//十六进制颜色值的正则表达式 
let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/; 

/*16进制颜色转为RGB格式*/  
export function colorRgb( hex ){  
    if( Array.isArray(hex) ){
        hex = hex[0]
    };
    if( !hex ){
        return 'RGB(0,0,0)'
    };
    
    let sColor = hex.toLowerCase();  
    if(sColor && reg.test(sColor)){  
        if(sColor.length === 4){  
            let sColorNew = "#";  
            for(let i=1; i<4; i+=1){  
                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));     
            }  
            sColor = sColorNew;  
        }  
        //处理六位的颜色值  
        let sColorChange = [];
        for(let i=1; i<7; i+=2){  
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

export function hex2rgb(hex, out){
	var rgb = [];
    for(var i=1; i<7; i+=2){
        rgb.push(parseInt("0x" + hex.slice(i,i+2)));
    }
    return rgb;
}

export function rgb2hex(rgb){
    let r = rgb[0];
    let g = rgb[1];
    let b = rgb[2];
	let hex = ((r<<16) | (g<<8) | b).toString(16);
    return "#" + new Array(Math.abs(hex.length-7)).join("0") + hex;
}

export function rgba2rgb( RGBA_color , background_color = "#ffffff" ){
    let [r,g,b,a] = RGBA_color.match(/[\d\.]+/g);

    let [br,bg,bb] = colorRgb( background_color ).match(/[\d\.]+/g);

    return "RGB(" + [
        (1 - a) * br + a * r,
        (1 - a) * bg + a * g,
        (1 - a) * bb + a * b
    ].join(',') + ")";
}


// 计算渐变过渡色
export function gradient (startColor,endColor,step=100){
    // 将 hex 转换为rgb
    let sColor = hex2rgb(startColor);
    let eColor = hex2rgb(endColor);

    // 计算R\G\B每一步的差值
    let rStep = (eColor[0] - sColor[0]) / step;
    let gStep = (eColor[1] - sColor[1]) / step;
    let bStep = (eColor[2] - sColor[2]) / step;

    var gradientColorArr = [];
    for(var i=0;i<step;i++){
      // 计算每一步的hex值
      gradientColorArr.push(rgb2hex( [
          parseInt(rStep*i+sColor[0]),
          parseInt(gStep*i+sColor[1]),
          parseInt(bStep*i+sColor[2]) 
      ]));
    }
    return gradientColorArr;
  }