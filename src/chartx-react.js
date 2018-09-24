import React from "react"
import Chartx from "./index"

class chartxReact extends React.Component {

  static defaultProps = {
    chartId   : null, //chartpark项目中对应的图表id
    width     : null, //支持 100px 100em 等字符串，也支持100number，会主动加上px，也支持小数0.5，主动变成50%
    height    : null, //功能同上
    className : ""  , //附加在dom容器上面的className，有一个默认的 .chartx-react
    options   : {}  , //用户传入的options配置，非必填，和chartId至少要有一个
    data      : []    //图表渲染数据
  }

  constructor(props) {
    super(props);

    this.myRef = React.createRef();

    this.chart = null;
    this.state = {
        options : this.getChartOptions() //最终用来渲染的options，如果有props.chartId和props.options，两者会做一次extend
    };

  }

  /**
   * 如果是options，data的props改变，则不需要重新渲染dom，只执行图表的渲染
   * 如果是width，height的改变，而且原来的width 和 height是绝对值的情况下，则需要重新渲染dom
   */
  shouldComponentUpdate(nextProps, nextState){
    if( nextProps.width == this.props.width && nextProps.height == this.props.height && nextProps.className == this.props.className ){
      this.updateChart(nextProps, nextState);
      return false
    };
    return true;
  }


  /**
   * 组件update完毕，reset对应的图表实例
   */
  componentDidUpdate(nextProps, nextState){
    //目前不建议也不支持reset、resetData 和 resize 同步执行
    //this.updateChart(nextProps, nextState);
    Chartx.resize();
  }

  /**
   * 构建一个用来渲染图表的容易dom节点
   */
  render() {
    /*
    let styles = this.getStyles();
    return (
      <div ref={this.myRef} 
      className={"chartx-react " + this.props.className} 
      style={styles}
      ></div>
    );
    */

    let styles = this.getStyles();
    return React.createElement("div", { ref: this.myRef,
      className: "chartx-react " + (this.props.className || ""),
      style: styles
    });
  }

  /**
   * 组件首次转载完毕
   * create对应的图表
   */
  componentDidMount(){
   
    const dom   = this.myRef.current;
    let data    = this.props.data;

    this.chart = Chartx.create( dom, data, this.state.options );

    if( !Chartx._registWindowOnResize ){
      //整个Chartx只需要注册一次window.onresize就够了
      window.addEventListener("resize", (e)=>{
          Chartx.resize();
      }, false);
      Chartx._registWindowOnResize = true;
    }
  }

  /**
   * 组件销毁
   * 销毁对应的图表
   */
  componentWillUnmount(){
    this.chart.destroy();
  }

  getChartOptions(){
    let options = this.props.options;
    if( this.props.chartId ){
      //options = Object.assign( Chartx.getOptions( this.props.chartId ), options );
      options = Chartx.canvax._.extend( true, Chartx.getOptions( this.props.chartId ), options );
    }
    return options;
  }

  getStyles(){
    let styles = {};
    this.setSize("width" , styles);
    this.setSize("height" , styles);
    return styles;
  }

  setSize( sizeType , styles ){
    if( this.props[sizeType] != null ){
      let _width = this.props[sizeType];
      if( !isNaN( _width ) ){
          if( _width < 1 ){
            styles[sizeType] = _width*100+"%";
          } else {
            styles[sizeType] = _width+"px";
          }
      } else {
        if( typeof _width == "string" ){
          styles[sizeType] = _width;
        }
      }
    };
  }

  updateChart(nextProps, nextState){
    //如果dom容器不需要重新渲染，但是还是要检测下options 和 data， 单独来reset图表对象
    let newChartOptions = this.getChartOptions();
    if( JSON.stringify( this.state.options ) != JSON.stringify( newChartOptions ) ){

      this.setState({
        options : newChartOptions
      });
      this.chart.reset( newChartOptions, nextProps.data );

    } else if( JSON.stringify( this.props.data ) != JSON.stringify( nextProps.data ) ){
      this.chart.resetData( nextProps.data );
    };

  }

}

export default chartxReact;
