define(
    "chartx/chart/original/sector/yAxis",
    [
        "chartx/components/yaxis/yAxis"
    ],
    function( yAxisBase ){
        var yAxis = function( opt , data ){
            yAxis.superclass.constructor.apply( this , arguments );
        };
        Chartx.extend( yAxis , yAxisBase , {
            updateLayout:function(data){
                var me = this
                _.each(me.sprite.children, function(children, i){
                    var o = data[i]

                    var y = o.y
                    var txt = children.children[0]

                    // if(me.pos.y + o.y - txt.getTextHeight() / 2 < 0){
                        // y = o.y + txt.getTextHeight() / 2
                    // }

                    txt.context.y = y

                    if(me.line.enabled){
                        var line = children.children[1]
                        line.context.y = o.y
                    }
                })
            },

            _initData:function(data){
                var arr = this._setDataSection(data);
                this.dataOrg     = data.org;
                this.dataSection = arr
            }
        } );
    
        return yAxis;
    } 
);
