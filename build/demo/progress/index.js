KISSY.ready(function (S) {
    KISSY.use('dvix/chart/progress/ , node ', function (S, Pregress) {
        var el = S.all('#loading');
        var pregress = new Pregress(el);
        pregress.draw();
        window.pregress = pregress;
    });
});