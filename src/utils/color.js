//十六进制颜色值的正则表达式 
var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/; 

/*16进制颜色转为RGB格式*/  
export function colorRgb( hex ){  
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

export function colorRgba(hex , a){
    return colorRgb( hex ).replace(')', ','+a+')').replace('RGB', 'RGBA');
};

export function hexTorgb(hex, out){
	//hex可能是“#ff0000” 也可能是 0xff0000
	if( hex.replace ){
	   hex = parseInt( hex.replace("#" , "0X") , 16 );
    };

    out = out || [];

    out[0] = ((hex >> 16) & 0xFF) / 255;
    out[1] = ((hex >> 8) & 0xFF) / 255;
    out[2] = (hex & 0xFF) / 255;

    return out;
}

export function hexTostring(hex){
     hex = hex.toString(16);
     hex = '000000'.substr(0, 6 - hex.length) + hex;

     return `#${hex}`;
}

export function rgbTohex(rgb){
	return (((rgb[0] * 255) << 16) + ((rgb[1] * 255) << 8) + (rgb[2] * 255));
}
