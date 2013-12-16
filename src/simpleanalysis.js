/*
* mobile ui 依赖 zepto.js  作者：wenren
*/
(function($){
	var SimpleAnalysis = function(elements,options){
		var newArray = [],Cun = parseInt(options.Cnumber),setData = options.setData;
		var newColor = ['#fec960','#49b5ed','#e86b66','#3dbc7c','#8794ff'];
		var Clen = newColor.length,Sindex = 1;
		setData.forEach(function(v,i){
			var count = Math.floor((parseInt(v.count) / Cun)*100);
			v.percentage = count + '%';
			newArray.push(count);
			if(i === Clen*Sindex){
				Sindex ++;
			}
			v.color = i < Clen ? newColor[i] : newColor[Clen - ((Clen*Sindex)%i + 1)];
		});
		var anRender = $.template.compile(options.template);
		var anHtml = anRender({"anaVote":options.setData});
		elements.html(anHtml);
		elements.show();
		var analyAnimate = elements.find('div.analyAnimate');
		var animate =  new $.animates();
		newArray.forEach(function(v,i){
			var slide = analyAnimate[i];
			animate.concat(slide,{width:v+'%'});
			animate.start();
		});
	}
	$.fn.simpleAnalysis = function(options){
		new SimpleAnalysis(this,options);
	}
	$.fn.simpleAnalysis.Constructor = SimpleAnalysis;
})(Zepto);