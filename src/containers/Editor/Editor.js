import React, { Component } from 'react';
import { Editor, EditorState, RichUtils, DefaultDraftBlockRenderMap } from 'draft-js';
import { Map } from 'immutable';
import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';
import utilFn from "./utilFunctions";
import Todos from '../Todo/Todo';
import IndentedTree from '../D3IndentedTree/IndentedTree';
import constants from '../..//constants/EditorConstants';
import EditorComponents from './editorComponents/EditorComponents';
import moment from 'moment';


const { hasCommandModifier } = KeyBindingUtil;

class Editor2 extends Component {

    constructor() {
        super();

        this.state = {
            editorState: EditorState.createEmpty(),
            editorPadding: 'very',
            recordId: 0,
            depthMap: new Map(),
            childMap: new Map(),
            childArray: [],
            title: 'Notes',
            dataNest: {}
        };

        const TODO_TYPE = 'todo';
        this.blockRenderMap = Map({
            [TODO_TYPE]: {
                element: 'div',
            }
        }).merge(DefaultDraftBlockRenderMap);

        this.onChange = this.onChange.bind(this);
        this.getEditorState = () => this.state.editorState;
        this._handleKeyCommand = this._handleKeyCommand.bind(this);
        this.keyBindingFn = this.keyBindingFn.bind(this);
        this.onTab = (e) => this._onTab(e);
        this.handleReturn = this.handleReturn.bind(this);
        this.saveDepthMap = this.saveDepthMap.bind(this);
        this.saveChildMap = this.saveChildMap.bind(this);
        // this.iterV = this.iterV.bind(this);
        this.createChildArray = this.createChildArray.bind(this);
        this.createDataWithChildArray = this.createDataWithChildArray.bind(this);
        this._handleBeforeInput = this._handleBeforeInput.bind(this);
        this._handlePastedText = this._handlePastedText.bind(this);
        this._toggleBlockType = this._toggleBlockType.bind(this);
        this._toggleInlineStyle = this._toggleInlineStyle.bind(this);
    }

    _onTab(e) {
        const maxDepth = 2;
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
    }

    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }

    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }

    /* to maintain the focus of the editor while starting */
    componentDidMount() {
        this.refs.editor.focus();
    }

    onChange(editorState) {
        this.setState({
            editorState
        });
    }

    keyBindingFn(event) {

        if (hasCommandModifier(event) && event.keyCode === 83) {
            return 'saveChart';
        } else if (hasCommandModifier(event) && event.keyCode === 13) {
            return 'printMap';
        }
        return getDefaultKeyBinding(event);
    }

    _handleKeyCommand(command) {
        if (command === 'saveChart') {
            console.log(this.state.dataNest);
            console.log(this.state.childMap);
            return 'handled';
        } else if (command === 'printEditorStateMap') {
            console.log(this.state.editorState.getCurrentContent().getBlockMap());
            console.log(this.state.dataNest);
            return 'handled';
        }
        const { editorState } = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return 'not-handled';
    }

    saveDepthMap() {
        let contentblockMap = this.state.editorState
            .getCurrentContent()
            .getBlockMap();

        let blockMap = new Map();
        contentblockMap.forEach(k => {
            blockMap = blockMap.set(k.getText(), k.getDepth());
        });

        let depthMap = new Map();
        let childMap = new Map();
        contentblockMap.forEach(k => {
            let depth = k.getDepth();
            let text = k.getText();
            let type = k.getType();
            if (text.replace(/^\s+|\s+$/g, '') !== undefined && text !== '' && type === "ordered-list-item") {
                if (!depthMap.has(depth)) {
                    depthMap = depthMap.set(depth, [text]);
                    childMap = this.saveChildMap(childMap, depthMap, depth, text, blockMap);
                    this.setState({
                        depthMap,
                        childMap,
                    }, () => {
                        // this.createChildArray();
                        this.setState({
                            childArray: utilFn.createChildArray(this.state.editorState.getCurrentContent().getBlockMap(), this.state.childMap)
                        }, () => {
                            this.setState({
                                dataNest: utilFn.createDataWithChildArray(this.state.childMap, this.state.childArray)
                            });
                        });
                    })
                } else if (depthMap.has(depth)) {
                    let array = depthMap.get(depth);
                    depthMap = depthMap.set(depth, array.concat([text]));
                    childMap = this.saveChildMap(childMap, depthMap, depth, text, blockMap);
                    this.setState({
                        depthMap,
                        childMap
                    }, () => {
                        this.setState({
                            childArray: utilFn.createChildArray(this.state.editorState.getCurrentContent().getBlockMap(), this.state.childMap)
                        }, () => {
                            this.setState({
                                dataNest: utilFn.createDataWithChildArray(this.state.childMap, this.state.childArray)
                            });
                        });
                    });
                }
            }
        });
    }

    saveChildMap(childMap, depthMap, depth, text) {
        if (depthMap.has(depth - 1)) {
            let newKey = depthMap.get(depth - 1)[depthMap.get(depth - 1).length - 1];
            if (depth < 3) {
                childMap = childMap.set(newKey, childMap.get(newKey).concat([text])).set(text, []);
            } else {
                childMap = childMap.set(newKey, childMap.get(newKey).concat([text]));
            }
        } else {
            childMap = childMap.set(text, []);
        }
        return childMap;
    }

    //only for development
    createChildArray(editorBlockMap) {
        let childArray = [];
        let childMap = this.state.childMap;
        this.state.editorState.getCurrentContent().getBlockMap().forEach((v, k) => {
            let text = v.getText();
            let type = v.getType();
            if (text.replace(/^\s+|\s+$/g, '') !== undefined && text !== '' && type === "ordered-list-item") {
                let obj = {};
                obj['name'] = v.getText();
                obj['children'] = childMap.get(v.getText()) === undefined ? [] : childMap.get(v.getText());
                obj['depth'] = v.getDepth();
                childArray.push(obj);
            }
        });

        this.setState({
            childArray
        }, () => {
            this.createDataWithChildArray();
        });
    }

    //only for development
    createDataWithChildArray(childMap, childArray, iterV) {
        let map = this.state.childMap;
        let dataNest;
        dataNest = this.state.childArray.filter(obj => obj.depth === 0).map(obj => {
            if (obj.children.length > 0) {
                return {
                    "name": obj.name,
                    "children": this.iterV(obj.children, map)
                }
            } else {
                return {
                    "name": obj.name
                }
            }
        });

        //add dataNest to the title object
        dataNest = {
            "name": this.state.title,
            "children": dataNest
        }
        this.setState({
            dataNest
        })
    }

    handleReturn(e) {
        return this.saveDepthMap();
    }

    _handleBeforeInput(str) {
        const { editorState } = this.state;
        const selection = editorState.getSelection();
        const currentBlock = editorState.getCurrentContent()
            .getBlockForKey(selection.getStartKey());
        const blockLength = currentBlock.getLength();

        if (blockLength > constants.EditorConstants.MAX_BLOCK_LENGTH - 1) {
            return 'handled';
        } else if (str !== '.') {
            return 'not-handled';
        } else if (str === '.') {
            if (blockLength === 1 && currentBlock.getText() === '1') {
                this.onChange((utilFn.resetBlockType(editorState, 'ordered-list-item')));
                return 'handled';
            }
        }
        return 'not-handled';
    }

    _handlePastedText = (pastedText) => {
        const { editorState } = this.state;
        const selection = editorState.getSelection();
        const currentBlock = editorState.getCurrentContent()
            .getBlockForKey(selection.getStartKey());
        const blockLength = currentBlock.getLength()
        const selectedTextLength = utilFn._getLengthOfSelectedText(this.state.editorState);

        if (blockLength + pastedText.length - selectedTextLength > constants.EditorConstants.MAX_BLOCK_LENGTH) {
            console.log('you can type max ten characters');

            return 'handled';
        }
    }

    render() {
        return (
            <div>
                <div className='editor row'>
                    <div className="text-editor col-8 card border-dark mb-3">
                        <div className="card-header RichEditor-controls">
                            <EditorComponents.InlineStyleControls
                                editorState={this.state.editorState}
                                onToggle={this._toggleInlineStyle}
                            />
                        </div>
                        <div className="card-body text-dark">
                            <Editor
                                className='editor'
                                editorState={this.state.editorState}
                                handleKeyCommand={this._handleKeyCommand}
                                onChange={this.onChange}
                                ref='editor'
                                keyBindingFn={this.keyBindingFn}
                                handleBeforeInput={this._handleBeforeInput}
                                onTab={this.onTab}
                                handleReturn={this.handleReturn}
                                handlePastedText={this._handlePastedText}
                            />
                        </div>
                        <div className="text-right px-2 app-footer">
                            <span className="px-2 right-span-border">
                                Ln Ct:
                                {
                                    this.state.editorState.getCurrentContent().getBlockMap().size - 1
                                }
                            </span>
                            <span>
                                Char Ct:
                                {
                                    this.state.editorState.getCurrentContent()
                                        .getBlockForKey(this.state.editorState.getSelection().getStartKey()).getLength()
                                }
                            </span>
                        </div>
                    </div>
                </div>
                <div className='editor row'>
                    <div className="text-editor col-8 card border-dark mb-3">
                        <div className="card-header">Chart</div>
                        <div className="card-body text-dark">
                            {!this.state.dataNest.children
                                ? <h5>Editor is Empty</h5>
                                : (
                                    <svg width={constants.IndentedTree.SVG_WIDTH} height={constants.IndentedTree.SVG_HEIGHT}>
                                        <IndentedTree data={this.state.dataNest} />
                                    </svg>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Editor2;