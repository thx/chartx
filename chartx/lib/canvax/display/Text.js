/**
 * Canvax--Text
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 文本 类
 **/

define(
    "canvax/display/Text",
    [
        "canvax/display/DisplayObject",
        "canvax/core/Base"
    ],
    function( DisplayObject , Base ) {
        var Text = function( text , opt ) {
            var self = this;
            self.type = "text";
            self._reNewline = /\r?\n/;
            self.fontProperts = [ "fontStyle" , "fontVariant" , "fontWeight" , "fontSize" , "fontFamily"];

            //做一次简单的opt参数校验，保证在用户不传opt的时候 或者传了opt但是里面没有context的时候报错
            opt = Base.checkOpt( opt );
            
            self._context = _.deepExtend({
                fontSize            : 13 , //字体大小默认13
                fontWeight          : "normal",
                fontFamily          : "微软雅黑",
                textDecoration      : null,  
                fillStyle           : 'blank',
                lineHeight          : 1.3,
                backgroundColor     : null ,
                textBackgroundColor : null
            } , opt.context);

            self._context.font = self._getFontDeclaration();

            self.text  = text.toString();

            arguments.callee.superclass.constructor.apply(this, [opt]);

        };

        Base.creatClass(Text , DisplayObject , {
            $watch : function( name , value , preValue ){
                 //context属性有变化的监听函数
                 if( _.indexOf(this.fontProperts , name) >= 0 ){
                     this._context[name] = value;
                     //如果修改的是font的某个内容，就重新组装一遍font的值，
                     //然后通知引擎这次对context的修改不需要上报心跳
                     this._notWatch    = false;
                     this.context.font = this._getFontDeclaration();
                     this.context.width  = this.getTextWidth();
                     this.context.height = this.getTextHeight();
                 }
            },
            init : function(text , opt){
               var self = this;
               var c = this.context;
               c.width  = this.getTextWidth();
               c.height = this.getTextHeight();
            },
            render : function( ctx ){
               for (p in this.context.$model){
                   if(p in ctx){
                       if ( p != "textBaseline" && this.context.$model[p] ) {
                           ctx[p] = this.context.$model[p];
                       };
                   };
               };
               this._renderText( ctx , this._getTextLines() );
            },
            resetText     : function( text ){
               this.text  = text.toString();
               this.heartBeat();
            },
            getTextWidth  : function(){
               var width = 0;
               Base._pixelCtx.save();
               Base._pixelCtx.font = this.context.font;
               width = this._getTextWidth(  Base._pixelCtx , this._getTextLines() );
               Base._pixelCtx.restore();
               return width;
            },
            getTextHeight : function(){
               return this._getTextHeight( Base._pixelCtx , this._getTextLines() );
            },
            _getTextLines : function(){
               return this.text.split( this._reNewline );
            },
            _renderText: function(ctx, textLines) {
                ctx.save();
                this._renderTextFill(ctx, textLines);
                this._renderTextStroke(ctx, textLines);
                ctx.restore();
            },
            _getFontDeclaration: function() {
                var self         = this;
                var fontArr      = [];
                    
                _.each( this.fontProperts , function( p ){
                    var fontP    =  self._context[p];
                    if( p == "fontSize" ) { 
                        fontP = parseFloat( fontP ) + "px"
                    }
                    fontP && fontArr.push( fontP );
                } );

                return fontArr.join(' ');

            },
            _renderTextFill: function(ctx, textLines) {
                if (!this.context.fillStyle ) return;

                this._boundaries = [ ];
                var lineHeights = 0;

                for (var i = 0, len = textLines.length; i < len; i++) {
                    var heightOfLine = this._getHeightOfLine(ctx, i, textLines);
                    lineHeights += heightOfLine;

                    this._renderTextLine(
                            'fillText',
                            ctx,
                            textLines[i],
                            0,//this._getLeftOffset(),
                            this._getTopOffset() + lineHeights,
                            i
                            );
                }
            },
            _renderTextStroke: function(ctx, textLines) {
                if ( (!this.context.strokeStyle || !this.context.lineWidth ) && !this._skipFillStrokeCheck) return;

                var lineHeights = 0;

                ctx.save();
                if (this.strokeDashArray) {
                    if (1 & this.strokeDashArray.length) {
                        this.strokeDashArray.push.apply(this.strokeDashArray, this.strokeDashArray);
                    }
                    supportsLineDash && ctx.setLineDash(this.strokeDashArray);
                }

                ctx.beginPath();
                for (var i = 0, len = textLines.length; i < len; i++) {
                    var heightOfLine = this._getHeightOfLine(ctx, i, textLines);
                    lineHeights += heightOfLine;

                    this._renderTextLine(
                            'strokeText',
                            ctx,
                            textLines[i],
                            0, //this._getLeftOffset(),
                            this._getTopOffset() + lineHeights,
                            i
                            );
                }
                ctx.closePath();
                ctx.restore();
            },
            _renderTextLine: function(method, ctx, line, left, top, lineIndex) {
                top -= this.context.fontSize / 4;

                if (this.context.textAlign !== 'justify') {
                    this._renderChars(method, ctx, line, left, top, lineIndex);
                    return;
                }

                var lineWidth = ctx.measureText(line).width;
                var totalWidth = this.context.width;

                if (totalWidth > lineWidth) {
                    var words = line.split(/\s+/);
                    var wordsWidth = ctx.measureText(line.replace(/\s+/g, '')).width;
                    var widthDiff = totalWidth - wordsWidth;
                    var numSpaces = words.length - 1;
                    var spaceWidth = widthDiff / numSpaces;

                    var leftOffset = 0;
                    for (var i = 0, len = words.length; i < len; i++) {
                        this._renderChars(method, ctx, words[i], left + leftOffset, top, lineIndex);
                        leftOffset += ctx.measureText(words[i]).width + spaceWidth;
                    }
                }
                else {
                    this._renderChars(method, ctx, line, left, top, lineIndex);
                }
            },
            _renderChars: function(method, ctx, chars, left, top) {
                ctx[method]( chars , 0 , top );
            },
            _getHeightOfLine: function() {
                return this.context.fontSize * this.context.lineHeight;
            },
            _getTextWidth: function(ctx, textLines) {
                var maxWidth = ctx.measureText(textLines[0] || '|').width;
                for (var i = 1, len = textLines.length; i < len; i++) {
                    var currentLineWidth = ctx.measureText(textLines[i]).width;
                    if (currentLineWidth > maxWidth) {
                        maxWidth = currentLineWidth;
                    }
                }
                return maxWidth;
            },
            _getTextHeight: function(ctx, textLines) {
                return this.context.fontSize * textLines.length * this.context.lineHeight;
            },

            /**
             * @private
             * @return {Number} Top offset
             */
            _getTopOffset: function() {
                var t = 0;
                switch(this.context.textBaseline){
                    case "top":
                         t = 0;
                         break; 
                    case "middle":
                         t = -this.context.height / 2;
                         break;
                    case "bottom":
                         t = -this.context.height;
                         break;
                }
                return t;
            },
            getRect : function(){
                var c = this.context;
                var x = 0;
                var y = 0;
                //更具textAlign 和 textBaseline 重新矫正 xy
                if( c.textAlign == "center" ){
                    x = -c.width / 2;
                };
                if( c.textAlign == "right" ){
                    x =  -c.width;
                };
                if( c.textBaseline == "middle" ){
                    y = -c.height / 2;
                };
                if( c.textBaseline == "bottom" ){
                    y = -c.height;
                };

                return {
                    x     : x,
                    y     : y,
                    width : c.width,
                    height: c.height
                }
            }
        });
        return Text;
    }
);