/**
 * @fileOverview zoom controller
 * @author litao.lt@alibaba-in.com
 * @version 1.0
 */

export default function( opt = {} ){

    let mouse = {
        x: 0, y: 0,
        rx: 0, ry: 0
    };
  
    let scale    = opt.scale    || 1;
    let scaleMin = opt.scaleMin || 1;
    let scaleMax = opt.scaleMax || 8;
    //世界坐标
    let wx       = 0;
    let wy       = 0;
    //舞台坐标
    let sx       = 0;
    let sy       = 0;

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

    let offset = ( pos ) => {
        mouse.x += pos.x;
        mouse.y += pos.y;
        return move( mouse );
    }

    let wheel = ( e, point ) => {
        
        mouseMoveTo(point);

        wx = mouse.rx; //set world origin
        wy = mouse.ry;
        sx = mouse.x;  //set screen origin
        sy = mouse.y;

        //判断上下滚动来设置scale的逻辑
        if (e.deltaY < 0) {
            scale = Math.min( scaleMax , scale * 1.1); //zoom in
        } else {
            scale = Math.max( scaleMin , scale * (1 / 1.1)); // zoom out is inverse of zoom in
        };

        return {
            scale,
            x: zoomedX(),
            y: zoomedY()
        };
    }

    let move = ( point ) => {
        let {xx,yy} = mouseMoveTo( point );
        wx -= mouse.rx - xx; 
        wy -= mouse.ry - yy;
        mouse.rx = zoomedX_INV(mouse.x);
        mouse.ry = zoomedY_INV(mouse.y);

        return {
            scale,
            x: zoomedX(),
            y: zoomedY()
        };

    }

    let getZoomedPoint = ( point={x:0,y:0} ) => {
        return {
            x: zoomedX( point.x ),
            y: zoomedY( point.y )
        }
    }

    this.wheel = wheel;
    this.move = move;
    this.mouseMoveTo = mouseMoveTo;
    this.offset = offset;
    this.getZoomedPoint= getZoomedPoint;
}