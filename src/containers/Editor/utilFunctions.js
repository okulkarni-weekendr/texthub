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

const createChildArray = (editorBlockMap, childMap) => {
    let childArray = [];
    editorBlockMap.forEach((v, k) => {
            let text = v.getText();
            if (text.replace(/^\s+|\s+$/g, '') !== undefined && text !== '') {
                let obj = {};
                obj['name'] = v.getText();
                obj['children'] = childMap.get(v.getText()) === undefined ? [] : childMap.get(v.getText());
                obj['depth'] = v.getDepth();
                childArray.push(obj);
            }
        });

        return childArray;
    }

const createDataWithChildArray = (childMap, childArray, title) => {
        const iterV = (v, map) => {
            return v.map(k => {
                let array;
                if (map.get(k) === undefined) {
                    array = []
                } else {
                    array = map.get(k)
                }
                map.delete(k);
                if (array.length > 0) {
                    return {
                        "name": k,
                        "children": iterV(array, map)
                    };
                } else {
                    return {
                        "name": k
                    }
                }
            });
        }
        let dataNest;
        dataNest = childArray.filter(obj => obj.depth === 0).map(obj => {
            if (obj.children.length > 0) {
                return {
                    "name": obj.name,
                    "children": iterV(obj.children, childMap)
                }
            } else {
                return {
                    "name": obj.name
                }
            }
        });

        //add dataNest to the title object
        dataNest = {
            "name": title,
            "children": dataNest
        }

        return dataNest;
    }

const _getLengthOfSelectedText = (editorState) => {
      const currentSelection = editorState.getSelection();
      const isCollapsed = currentSelection.isCollapsed();
      
      let length = 0;
      
      if (!isCollapsed) {
        const currentContent = editorState.getCurrentContent();
        const startKey = currentSelection.getStartKey();
        const endKey = currentSelection.getEndKey();
        const startBlock = currentContent.getBlockForKey(startKey);
        const isStartAndEndBlockAreTheSame = startKey === endKey;
        const startBlockTextLength = startBlock.getLength();
        const startSelectedTextLength = startBlockTextLength - currentSelection.getStartOffset();
        const endSelectedTextLength = currentSelection.getEndOffset();
        const keyAfterEnd = currentContent.getKeyAfter(endKey);
        
        if (isStartAndEndBlockAreTheSame) {
            length += currentSelection.getEndOffset() - currentSelection.getStartOffset();
        } else {
            let currentKey = startKey;

            while (currentKey && currentKey !== keyAfterEnd) {
                if (currentKey === startKey) {
                    length += startSelectedTextLength + 1;
                } else if (currentKey === endKey) {
                    length += endSelectedTextLength;
                } else {
                    length += currentContent.getBlockForKey(currentKey).getLength() + 1;
                }
    
                currentKey = currentContent.getKeyAfter(currentKey);
            }
        }
      }
      return length;
    } 

const utilFn = {
    _getLengthOfSelectedText,
    getBlockRendererFn,
    resetBlockType,
    saveMapState,
    createChildArray,
    createDataWithChildArray
};

export default utilFn;