/*
* mobile ui 2d css3动画 依赖 zepto.js  作者：wenren
*/
(function($){
  	$.transform = function(slides,index, dist, speed){
  		var slide = slides[index];
	        var style = slide && slide.style;
	        if (!style) return;
	        style.webkitTransitionDuration =
	            style.MozTransitionDuration =
	                style.msTransitionDuration =
	                    style.OTransitionDuration =
	                        style.transitionDuration = speed + 'ms';

	        style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
	        style.msTransform =
	            style.MozTransform =
	                style.OTransform = 'translateX(' + dist + 'px)';
  	}
})(Zepto);