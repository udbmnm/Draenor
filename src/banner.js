/*
* mobile ui banner 依赖 zepto.js  作者：wenren
*/
(function($){
    var Banner = function(){
        
    }
    $.fn.banner = function(options){
        var $this = $(this);
        var data = $this.data('banner');
        var $id = $this.attr('id');
        if(!data) $this.data('banner',(data = new Banner($id,$this,options)));
    }
    $.fn.banner.Constructor = Banner;
})(Zepto);