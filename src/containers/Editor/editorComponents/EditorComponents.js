import React, { Component } from 'react';
import constants from '../../../constants/EditorConstants';

class StyleButton extends React.Component {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    render() {
        let className = 'px-2 RichEditor-styleButton';
        if (this.props.active) {
            className += 'px-2 RichEditor-activeButton';
        }

        return (
            <span className={className} onMouseDown={this.onToggle}>
                <i className={this.props.label}></i>
            </span>
        );
    }
}

const InlineStyleControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return (
      <div className="RichEditor-controls">
        {constants.INLINE_STYLES.map(type =>
          <StyleButton
            key={type.label}
            active={currentStyle.has(type.style)}
            label={type.label}
            onToggle={props.onToggle}
            style={type.style}
          />
        )}
      </div>
    );
  };

const BlockStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div className="RichEditor-controls">
        {constants.BLOCK_TYPES.map((type) =>
            <StyleButton
            key={type.label}
            active={type.style === blockType}
            label={type.label}
            onToggle={props.onToggle}
            style={type.style}
            />
        )}
        </div>
    );
};

export default {
    InlineStyleControls,
    BlockStyleControls
};