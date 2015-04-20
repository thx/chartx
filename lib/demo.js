function mirrorResize(){
    var vh = document.documentElement.clientHeight||document.body.clientHeight
    $(".CodeMirror ,#chartdemo-r").css("height" , vh+"px");
    var vw = document.documentElement.clientWidth ||document.body.clientWidth
    $(".CodeMirror , #td-vl").css("width" , (vw * 2 / 5) +"px");
}
$(function(){
    var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true
    }); 
    editor.setOption("theme", "zenburn");
    $("#run").on("click" , function(){
        window.eval(editor.getValue());
    });
    mirrorResize();
    document.body.onresize = function(){
        mirrorResize();
    };
    window.eval(editor.getValue());
});
