var props = [
    {
        label  : 'type',
        detail : '坐标系组件',
        kind   : monaco.languages.CompletionItemKind.Function,
        documentation : "坐标系组件，可选值有'rect'（二维直角坐标系）,'polar'（二维极坐标系）,'box'（三维直角坐标系） ",
        insertText    : "type: ",
        values        : ["rect","polar","box"]
        
    }
]

export default props;