const EditorConstants = {
    MAX_BLOCK_LENGTH: 280,
    MAX_DEPTH: 2,
};

const IndentedTree = {
    SVG_WIDTH: 960,
    SVG_HEIGHT: 800,
    BAR_HEIGHT_TITLE: 25,
    BAR_HEIGHT_TEXT: 65,
    BAR_WIDTH_TITLE: 250,
    BAR_WIDTH_TEXT: 530,
    NODEENTER_TEXT_X: 5,
    NODEENTER_TEXT_Y: 5,
    TEXT_WRAP_WIDTH: 515
}

const INLINE_STYLES = [
    {label: 'fa fa-bold', style: 'BOLD'},
    {label: 'fa fa-italic', style: 'ITALIC'},
    {label: 'fa fa-underline', style: 'UNDERLINE'},
    {label: 'fa fa-code', style: 'CODE'},
  ];

const BLOCK_TYPES = [
    {label: 'H1', style: 'header-one'},
    {label: 'H2', style: 'header-two'},
    {label: 'H3', style: 'header-three'},
    {label: 'H4', style: 'header-four'},
    {label: 'H5', style: 'header-five'},
    {label: 'H6', style: 'header-six'},
    {label: 'Blockquote', style: 'blockquote'},
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'},
    {label: 'Code Block', style: 'code-block'},
]


const d3Constants = {
    EditorConstants,
    IndentedTree,
    INLINE_STYLES,
    BLOCK_TYPES
}
export default d3Constants;