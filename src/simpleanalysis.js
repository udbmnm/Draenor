/*
* mobile ui 依赖 zepto.js  作者：wenren
*/
(function($){
	var SimpleAnalysis = function(elements,options){
		var newArray = [],Cun = parseInt(options.Cnumber),setData = options.setData;
		console.log($.stringify(setData));
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

//[{"count":"17","is_answer":"0","item_index":"3","item_title":"贵的离谱","item_image_url":" "},{"count":"0","is_answer":"0","item_index":"4","item_title":"好便宜啊","item_image_url":" "},{"count":"60","is_answer":"1","item_index":"1","item_title":"还可以","item_image_url":" "},{"count":"100","is_answer":"0","item_index":"2","item_title":"有点贵","item_image_url":" "}]


// <script type="text/html" id="vote-template-analysis">
// 	<%var is_answer;%>
// 	<%anaVote.forEach(function(v){%>
// 		<div class="vote-box" data-index="<%=v.item_index%>">
// 			<p><%=v.item_title%></p>
// 			<div class="pad-box-10">
// 				<div class="analymate">
// 					<div class="analyAnimate" style="background:<%=v.color%>"></div>
// 				</div>
// 				<div class='percentage <%=is_answer= v.is_answer == 1 ?  "onColor" : "";%>' style="background:#fff;"><%=v.percentage%></div>
// 			</div>
// 		</div>
// 	<%})%>
// </script>