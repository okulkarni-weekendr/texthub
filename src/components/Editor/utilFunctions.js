import { EditorState } from 'draft-js';

const getDefaultBlockData = ( blockType,  initialData = {}) => {
    switch(blockType){
        case 'ordered-list-item': return initialData;
        default: return initialData;
    }
};

const resetBlockType = (editorState, newType) => {

    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();

    const key = selectionState.getStartKey();

    const blockMap = contentState.getBlockMap();
    const block = blockMap.get(key);

    let newText = '';

    if(block.getLength() >= 2){
        newText = block.getText().substr(1);
    }

    /**
     * @param text
     * @param type
     * @param data
     */
    const newBlock = block.merge({
        text: newText,
        type: newType,
        data: getDefaultBlockData(newType)
    });

    const newContentState = contentState.merge({
        blockMap: blockMap.set(key, newBlock),
        selectionAfter: selectionState.merge({
            anchorOffset: 0,
            focusOffset: 0,
        })
    });

    return EditorState.push(editorState, newContentState, 'change-block-type');
};

const getBlockRendererFn = (getEditorState, onChange) => (block) => {
    const type = block.getType();
    switch(type) {
        case 'todo':
            return null;
        default:
            return null;
    }
};

const saveMapState = (editorState, depthMap) => {
    let newDepthMap = depthMap;

    const k = editorState.getCurrentContent()
        .getBlockForKey(
            editorState.getSelection().getStartKey()
        );

    const d = k.getDepth();
    const t = k.getText();
    if(depthMap.get(d)){
        newDepthMap.set(d, depthMap.get(d).push(t));
    }else{
        newDepthMap.set(d, [t]);
    }
    return newDepthMap;
};


const utilFn = {
    getBlockRendererFn,
    resetBlockType,
    saveMapState
};

export default utilFn;