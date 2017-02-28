require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
var imgsData = require('../data/imagesData.json');

imgsData = (function initImgsData(imgsData){
	for(var i=0; i<imgsData.length;i++){
		var imgDataObj = imgsData[i];
		imgDataObj.imageURL = require('../images/' + imgDataObj.fileName);
		imgsData[i] = imgDataObj;
	}
	return imgsData;
})(imgsData);

class AppComponent extends React.Component {
  render() {
    return (
    	<section className="stage">
    		<section className="img-sec">
    		</section>
    		<nav className="controller-nav">
    		</nav>
    	</section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;