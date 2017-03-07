require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
var imgsData = require('../data/imagesData.json');

imgsData = (function initImgsData(imgsData){
	for(var i=0; i<imgsData.length;i++){
		var imgDataObj = imgsData[i];
		imgDataObj.imageURL = require('../images/' + imgDataObj.fileName);
		imgsData[i] = imgDataObj;
	}
	return imgsData;
})(imgsData);

var ImgFigureComponent = React.createClass({

    handleClick:function(e){

        if (this.props.arrange.isCenter) {
          this.props.inverse();
        } else {
          this.props.center();
        }

        e.stopPropagation();
        e.preventDefault();
    },

    render(){

        var styleObj = {};
        if(this.props.arrange.pos){
            styleObj = this.props.arrange.pos;
        }
        if(this.props.arrange.rotate){
            (['Moz','Webkit','ms','']).forEach(function(value){
                styleObj[value+'transform'] = 'rotate('+this.props.arrange.rotate+'deg)';
            }.bind(this));
        }

        if (this.props.arrange.isCenter) {
          styleObj.zIndex = 11;
        }

        var imgFigureClassName='img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

        if(this.props.arrange.isCenter){

        }

        return (
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
                <img src={this.props.data.imageURL} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick}>
                        <p>
                            {this.props.data.desc}
                        </p>
                    </div>
                </figcaption>
            </figure>
        );
    }
});

//控制组件
var ControllerUnit = React.createClass({
    handleClick:function(e){
        if (this.props.arrange.isCenter) {
          this.props.inverse();
        } else {
          this.props.center();
        }
        e.preventDefault();
        e.stopPropagation();
    },
    render(){
        var conUnitClassName = 'controller-unit';
        conUnitClassName += this.props.arrange.isCenter?' is-center':'';
        conUnitClassName += this.props.arrange.isInverse?' is-inverse':'';
        return (
            <span className={conUnitClassName} onClick={this.handleClick}></span>
        );
    }
});

function getRangeRandom(low,high){
    return Math.ceil(Math.random()*(high-low)+low);
}

function get30DegRandom(){
    return (Math.random() > 0.5 ? '':'-')+Math.ceil(Math.random()*30);
}

const AppComponent = React.createClass({
    Constant:{
        centerPos:{
            left:0,
            top:0
        },
        hPosRange:{    //左右两个分区位置
            leftSecX:[0,0],
            rightSecX:[0,0],
            y:[0,0]
        },
        vPosRange:{    //中间一个分区位置
            topx:[0,0],
            topy:[0,0]
        }
    },

    inverse:function(index){
        return function(){
            var imgsArr = this.state.imgsArr;
            imgsArr[index].isInverse = !imgsArr[index].isInverse;
            this.setState({
                imgsArr:imgsArr
            });
        }.bind(this);
    },

    center: function (index) {
        return function () {
          this.reArrange(index);
        }.bind(this);
    },

    //重新布局所有图片
    reArrange(centerIndex) {
        var imgsArr = this.state.imgsArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            leftSecX = hPosRange.leftSecX,
            rightSecX = hPosRange.rightSecX,
            hY = hPosRange.y,
            topx = vPosRange.topx,
            topy = vPosRange.topy;



        //居中图片
        var imgsCenter = imgsArr.splice(centerIndex,1);
        imgsCenter[0] = {
            pos:centerPos,
            rotate:0,
            isCenter:true
        }

        //中间一个分区位置
        var topImgArr = [];
        var topImgNum = Math.ceil(Math.random()*2);  //取一个或者不取
        var topImgIndex = 0;
        topImgIndex = Math.floor(Math.random()*(imgsArr.length - topImgNum));
        topImgArr = imgsArr.splice(topImgIndex,topImgNum);
        topImgArr.forEach(function(value,index){
            topImgArr[index] = {
                pos:{
                    top:getRangeRandom(topy[0],topy[1]),
                    left:getRangeRandom(topx[0],topx[1])
                },
                rotate:get30DegRandom()
            }
        });

        //布局左右两侧图片
        for(var i=0,j=imgsArr.length,k=j/2;i<j;i++){
            if(i<k){
                imgsArr[i] = {
                    pos:{
                        top:getRangeRandom(hY[0],hY[1]),
                        left:getRangeRandom(leftSecX[0],leftSecX[1])
                    },
                    rotate:get30DegRandom()
                }
            } else{
                imgsArr[i] = {
                    pos:{
                        top:getRangeRandom(hY[0],hY[1]),
                        left:getRangeRandom(rightSecX[0],rightSecX[1])
                    },
                    rotate:get30DegRandom()
                }
            }
        }


        if(topImgArr && topImgArr[0]){
            imgsArr.splice(topImgIndex,0,topImgArr[0]);
        }

        imgsArr.splice(centerIndex,0,imgsCenter[0]);


        this.setState({
            imgsArr : imgsArr
        });

    },

    getInitialState:function(){
        return {
            imgsArr:[
            ]
        }
    },

    //组件加载以后，为每张图片计算位置
    componentDidMount(){
        var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW/2),
            halfStageH = Math.ceil(stageH/2);

        var imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDom.scrollWidth,
            imgH = imgFigureDom.scrollHeight,
            halfImgW = Math.ceil(imgW/2),
            halfImgH = Math.ceil(imgH/2);

        //中心位置
        this.Constant.centerPos = {
            left:halfStageW - halfImgW,
            top:halfStageH-halfImgH
        }

        //左区域
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW-halfImgW*3;

        //右区域
        this.Constant.hPosRange.rightSecX[0] = halfStageW+halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW-halfImgW;

        //左右区域上下
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH-halfImgH;

        //中间区域
        this.Constant.vPosRange.topx[0] = halfStageW-imgW;
        this.Constant.vPosRange.topx[1] = halfStageW;
        this.Constant.vPosRange.topy[0] = -halfImgH;
        this.Constant.vPosRange.topy[1] = halfImgH-halfImgH*3;


        this.reArrange(0);
    },
    
    render() {
        var controllerUnits = [],
            imgFigures = [];

        imgsData.forEach(function(value,index){
            if(!this.state.imgsArr[index]){
                this.state.imgsArr[index] = {
                    pos:{
                        left:'0',
                        top:'0'
                    },
                    rotate:0,
                    isInverse:false,
                    isCenter:false
                }
            }
            imgFigures.push(<ImgFigureComponent center={this.center(index)} inverse={this.inverse(index)} key={'imgFigure'+index} data={value} ref={'imgFigure'+index} arrange={this.state.imgsArr[index]} />);

            controllerUnits.push(<ControllerUnit center={this.center(index)} key={'controllerUnit'+index} inverse={this.inverse(index)} arrange={this.state.imgsArr[index]}/>);
        }.bind(this));

        return (
        	<section className="stage" ref="stage">
        		<section className="img-sec">
                    {imgFigures}
        		</section>
        		<nav className="controller-nav">
                    {controllerUnits}
        		</nav>
        	</section>
        );
    }
});

export default AppComponent;