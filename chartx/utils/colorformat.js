define(
    "chartx/utils/colorformat",
    [
    
    ],
    function(){
        //十六进制颜色值的正则表达式 
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/; 

        /*16进制颜色转为RGB格式*/  
        var colorRgb = function( hex ){  
            var sColor = hex.toLowerCase();  
            if(sColor && reg.test(sColor)){  
                if(sColor.length === 4){  
                    var sColorNew = "#";  
                    for(var i=1; i<4; i+=1){  
                        sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));     
                    }  
                    sColor = sColorNew;  
                }  
                //处理六位的颜色值  
                var sColorChange = [];
                for(var i=1; i<7; i+=2){  
                    sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));    
                }  
                return "RGB(" + sColorChange.join(",") + ")";  
            } else {  
                return sColor;    
            }  
        };

        var colorRgba = function(hex , a){
            return colorRgb( hex ).replace(')', ','+a+')').replace('RGB', 'RGBA');
        };

        /*RGB颜色转换为16进制*/
        var colorHex = function( rgb ){  
            var that = rgb;  
            if(/^(rgb|RGB)/.test(that)){  
                var aColor = that.replace(/(?:||rgb|RGB)*/g,"").split(",");  
                var strHex = "#";  
                for(var i=0; i<aColor.length; i++){  
                    var hex = Number(aColor[i]).toString(16);  
                    if(hex === "0"){  
                        hex += hex;   
                    }  
                    strHex += hex;  
                }  
                if(strHex.length !== 7){  
                    strHex = that;    
                }  
                return strHex;  
            }else if(reg.test(that)){  
                var aNum = that.replace(/#/,"").split("");  
                if(aNum.length === 6){  
                    return that;      
                }else if(aNum.length === 3){  
                    var numHex = "#";  
                    for(var i=0; i<aNum.length; i+=1){  
                        numHex += (aNum[i]+aNum[i]);  
                    }  
                    return numHex;  
                }  
            }else{  
                return that;      
            }  
        };  

        return {
            colorRgb : colorRgb,
            colorRgba: colorRgba,
            colorHex : colorHex
        }

    }
)
