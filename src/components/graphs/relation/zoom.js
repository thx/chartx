export default function(){

    let mouse = {
        x : 0, //鼠标在画布坐标系内的x，可以理解为全局的缩放原点x
        y : 0, //鼠标在画布坐标系内的y，可以理解为全局的缩放原点y
        rx: 0, //真实坐标系中的坐标值
        ry: 0
    };
  
    let scale = 1;
    let wx    = 0;
    let wy    = 0;
    let sx    = 0;
    let sy    = 0;

    let zoomedX = (x=0) => { 
        return Math.floor((x - wx) * scale + sx);
    }

    let zoomedY = (y=0) => { 
        return Math.floor((y - wy) * scale + sy);
    }

    let zoomedX_INV = (mouseX=0) => { 
        return Math.floor((mouseX - sx) * (1 / scale) + wx);
    }

    let zoomedY_INV = (mouseY=0) => {
        return Math.floor((mouseY - sy) * (1 / scale) + wy);
    }

    let mouseMoveTo = ( point ) => {
        mouse.x = point.x;
        mouse.y = point.y;
        var xx  = mouse.rx;
        var yy  = mouse.ry;
        mouse.rx = zoomedX_INV(mouse.x);
        mouse.ry = zoomedY_INV(mouse.y);
        return {xx,yy}
    }

    let wheel = ( e, point ) => {
        
        mouseMoveTo(point);

        wx = mouse.rx; //set world origin
        wy = mouse.ry;
        sx = mouse.x;  //set screen origin
        sy = mouse.y;

        //判断上下滚动来设置scale的逻辑
        if (e.deltaY < 0) {
            scale = Math.min(5, scale * 1.1); //zoom in
        } else {
            scale = Math.max(0.1, scale * (1 / 1.1)); // zoom out is inverse of zoom in
        };

        return {
            scale,
            x: zoomedX(),
            y: zoomedY()
        };
    }

    let drag = ( point ) => {

        let {xx,yy} = mouseMoveTo( point );

        wx -= mouse.rx - xx; 
        wy -= mouse.ry - yy;

        // wx wy 变了，重新计算rx ry
        mouse.rx = zoomedX_INV(mouse.x);
        mouse.ry = zoomedY_INV(mouse.y);

        return {
            scale,
            x: zoomedX(),
            y: zoomedY()
        };

    }

    //计算point通过zoom计算后的偏移位置新 point
    let getZoomedPoint = ( point={x:0,y:0} ) => {
        return {
            x: zoomedX( point.x ),
            y: zoomedY( point.y )
        }
    }

    this.wheel = wheel;
    this.drag = drag;
    this.mouseMoveTo = mouseMoveTo;
    this.getZoomedPoint= getZoomedPoint;
}