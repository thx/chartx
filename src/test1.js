//坐标系组件
import { _,getDefaultProps } from "mmvis"

let aa_test = class aa_test{};
let bb_test = class aa_test{};
let defaultProps = {
    name : 'nickli'
}
 class test1 {
    constructor(){
        _.extend( true, this, getDefaultProps( defaultProps ) );
    }
};


export {test1}
