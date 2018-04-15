import { Map } from 'immutable';
import { DefaultDraftBlockRenderMap, EditorState } from 'draft-js';
import TodoBlock from './Todo';


const TODO_TYPE = 'todo';

/*
Returns default block-level metadata for various block type. Empty object otherwise.
*/
const getDefaultBlockData = (blockType, initialData = {}) => {
    switch (blockType) {
        case TODO_TYPE: return { checked: false };
        default: return initialData;
    }
};

const resetBlockType = (editorState, newType) => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const key = selectionState.getStartKey();
    const blockMap = contentState.getBlockMap();
    const block = blockMap.get(key);
    console.log(block);
    let newText = '';
    const text = block.getText();
    if (block.getLength() >= 2) {
        console.log(block.getText());
        newText = text.substr(1);
    }

    const newBlock = block.merge({
        text: '1',
        type: newType,
        data: getDefaultBlockData(newType),
    });
    const newContentState = contentState.merge({
        blockMap: blockMap.set(key, newBlock),
        selectionAfter: selectionState.merge({
            anchorOffset: 0,
            focusOffset: 0,
        }),
    });
    return EditorState.push(editorState, newContentState, 'change-block-type');
};

const updateDataOfBlock = (editorState, block, newData) => {
    const contentState = editorState.getCurrentContent();
    const newBlock = block.merge({
        data: newData,
    });
    const newContentState = contentState.merge({
        blockMap: contentState.getBlockMap().set(block.getKey(), newBlock),
    });
    return EditorState.push(editorState, newContentState, 'change-block-type');
};

const getBlockRendererFn = (getEditorState, onChange) => (block) => {
    const type = block.getType();
    switch(type) {
        case TODO_TYPE:
            return {
                component: TodoBlock,
                props: {
                    onChange,
                    getEditorState,
                },
            };
        default:
            return null;
    }
};

const utilFunctions = {
    getBlockRendererFn,
    TODO_TYPE,
    resetBlockType,
    updateDataOfBlock
};

export default utilFunctions;






