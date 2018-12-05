/**
 * 每个组件中对外影响的时候，要抛出一个trigger对象
 * 上面的comp属性就是触发这个trigger的组件本身
 * params属性则是这次trigger的一些动作参数
 * 目前legend和datazoom组件都有用到
 */
export default class Trigger
{
    constructor(comp, params = {})
    {
        this.comp = comp;
        this.params = params;
    }
}