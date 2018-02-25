import React, { Component } from 'react';
import Stack from '../utils/stack';
import { Editor, EditorState, RichUtils, DefaultDraftBlockRenderMap } from 'draft-js';
import { Divider } from 'semantic-ui-react';
import { Map } from 'immutable';
import {getDefaultKeyBinding, KeyBindingUtil} from 'draft-js';
import utilFn from "./utilFunctions";
const {hasCommandModifier} = KeyBindingUtil;

class Editor2 extends Component {

    constructor(){
        super();

        this.state = {
            editorState: EditorState.createEmpty(),
            editorPadding: 'very',
            recordId: 0,
            depthMap: new Map(),
            childMap: new Map(),
            childArray: []
        };

        const TODO_TYPE = 'todo';
        this.blockRenderMap = Map({
            [TODO_TYPE]: {
                element: 'div',
            }
        }).merge(DefaultDraftBlockRenderMap);

        this.onChange = this.onChange.bind(this);
        this.getEditorState = () => this.state.editorState;
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.keyBindingFn = this.keyBindingFn.bind(this);
        this.handleBeforeInput = this.handleBeforeInput.bind(this);
        this.onTab = (e) => this._onTab(e);
        this.handleReturn = this.handleReturn.bind(this);
        this.saveDepthMap = this.saveDepthMap.bind(this);
        this.saveChildMap = this.saveChildMap.bind(this);
        this.createStack = this.createStack.bind(this);
    }

    _onTab(e) {
        const maxDepth = 2;
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
    }

    /* to maintain the focus of the editor while starting */
    componentDidMount(){
        this.refs.editor.focus();
    }

    onChange(editorState){
        this.setState({
            editorState
        });
    }

    keyBindingFn(event){

        if (KeyBindingUtil.hasCommandModifier(event) && event.keyCode === 83) {
            return 'saveChart';
        }else if(KeyBindingUtil.hasCommandModifier(event) && event.keyCode === 13){
            return 'printMap';
        }else if(KeyBindingUtil.hasCommandModifier(event) && event.keyCode === 80){
            return 'printEditorStateMap';
        }

        return getDefaultKeyBinding(event);
    }

    handleKeyCommand(command){
        let editorState = this.state.editorState;
       
        if (command === 'saveChart') {
            return 'handled';
        }else if(command === 'printEditorStateMap'){
            let map = this.state.editorState.getCurrentContent().getBlockMap();
            map.forEach((k,v) => console.log(k.getText(), k.getDepth()));
            return 'handled';
        }
        return 'not-handled';
    }

    saveDepthMap(){
        let contentblockMap = this.state.editorState
                            .getCurrentContent()
                            .getBlockMap()
        
        let blockMap = new Map();
        contentblockMap.forEach(k => {
            blockMap = blockMap.set(k.getText(), k.getDepth());
        });

        let depthMap = new Map();
        let childMap = new Map();
        let data = new Object();
        
        contentblockMap.forEach(k => {
            let depth = k.getDepth();
            let text = k.getText();
            if(text.replace(/^\s+|\s+$/g, '') !== undefined && text !== ''){
                if(!depthMap.has(depth)){
                    depthMap = depthMap.set(depth, [text]);
                    childMap = this.saveChildMap(childMap, depthMap, depth, text, blockMap);
                    this.setState({
                        depthMap,
                        childMap
                    }, () => {
                        console.log(this.state.depthMap, this.state.childMap);
                    });
                }else if(depthMap.has(depth)){
                        let array =  depthMap.get(depth);
                        depthMap = depthMap.set(depth, array.concat([text]));
                        childMap = this.saveChildMap(childMap, depthMap, depth, text, blockMap);
                        this.setState({
                            depthMap,
                            childMap
                        }, () => {
                            console.log(this.state.depthMap, this.state.childMap);
                        });
                }
            }
        });
    }

    saveChildMap(childMap, depthMap, depth, text, blockMap){
        
        let editorBlockmap = blockMap
        if(depthMap.has(depth-1)){
            let newKey = depthMap.get(depth - 1)[depthMap.get(depth - 1).length - 1];
            if(depth < 3){
                childMap = childMap.set(newKey, childMap.get(newKey).concat([text])).set(text, []);
               
            }else{
                childMap = childMap.set(newKey, childMap.get(newKey).concat([text]));
            }
            let stack = this.createStack(new Stack(), newKey, editorBlockmap, depthMap);
            while(!stack.isEmpty()){
                console.log(stack.pop());
            }
        }else{
            childMap = childMap.set(text, []);
        }
        return childMap
    }

    createStack(stack, parent, blockMap, depthMap){
        if(depthMap.get(parent) === 0){
            return stack.push(parent);
        }
        stack.push(parent);
        let tempArray = depthMap.get(blockMap.get(parent) - 1)
        let newParent = tempArray[tempArray.length - 1]
        return this.createStack(stack, newParent, blockMap, depthMap);
    }

    handleReturn(e){
        return this.saveDepthMap();
    }

    handleBeforeInput(str){
        if(str !== '.'){
            return false;
        }

        const { editorState } = this.state;
        const selection = editorState.getSelection();

        const currentBlock = editorState.getCurrentContent()
            .getBlockForKey(selection.getStartKey());

        const blockType = currentBlock.getType();
        const blockLength = currentBlock.getLength();

        if(blockLength === 1 && currentBlock.getText() === '1'){
            this.onChange((utilFn.resetBlockType(editorState, 'ordered-list-item')));
            return true;
        }
        
        return false;
    }

    render() {
        return (
            <div className='svgDiv' id='style-4' onClick={this.focus}>
                <h2>Start with your notes here..</h2>
                <Divider />
                <Editor
                    className='editor'
                    editorState={this.state.editorState}
                    handleKeyCommand={this.handleKeyCommand}
                    onChange={this.onChange}
                    ref='editor'
                    keyBindingFn={this.keyBindingFn}
                    handleBeforeInput={this.handleBeforeInput}
                    onTab={this.onTab}
                    handleReturn={this.handleReturn}
                />
            </div>
        );
    }
}

export default Editor2;
