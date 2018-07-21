//图表皮肤
import globalTheme from "./theme";

export default {
    setGlobalTheme: function( colors ){
        globalTheme.set( colors );
    },
    getGlobalTheme: function(){
        return globalTheme.get();
    },
    
    instances : {},
    getChart : function( chartId ){
        return this.instances[ chartId ];
    },
    resize : function(){
        //调用全局的这个resize方法，会把当前所有的 chart instances 都执行一遍resize
        for( var c in this.instances ){
            this.instances[ c ].resize();
        }
    },
    
    getOptions : function( chartPark_cid , options ){
        //chartPark_cid,chartpark中的图表id
        if( !options ){
            options = this.options;
        };

        if( !options[ chartPark_cid ] ){
            return;
        };
        var JsonSerialize = {
            prefix: '[[JSON_FUN_PREFIX_',
            suffix: '_JSON_FUN_SUFFIX]]'
        };
        var parse = function(string){
            return JSON.parse( string ,function(key, value){
                if((typeof value === 'string') && 
                   (value.indexOf(JsonSerialize.suffix) > 0) && 
                   (value.indexOf(JsonSerialize.prefix) == 0)
                ){
                    return (new Function('return ' + value.replace(JsonSerialize.prefix, '').replace(JsonSerialize.suffix, '')))();
                }
                
                return value;
            })||{};
        };
        var opt = parse( decodeURIComponent( options[ chartPark_cid ] || {} ) );
        return opt;
    }
};