/*
* mobile ui banner 依赖 zepto.js  作者：wenren
*/
(function($){
    var Banner = function(id,options){
        this.id = id.attr('id');
        this.el = id;
        this.parent = this.el.parent();
        this.width = this.parent.width();
        this.options = options;
        this.child = this.el.children();
        if(this.options.template === undefined) {
          this.el.css({width:this.width*this.options.list});
          this.child.css({width:this.width});
        }
        var list = '<ul id="ul_'+this.id+'" class="banner_btn">';
        for(var i = 0;i<this.options.list;i++){
            if(i === 0){
               list += '<li class="hover"></li>';
               continue;
            } 
            list += '<li></li>';
        }
        list += '</ul>';
        this.parent.append(list);
        this.list = $('#ul_'+this.id).children();
        this._init();
        this.index = 1;
        this.max = this.options.list;
        this.animate = new jsMorph();
    }
    Banner.prototype = {
        _init:function(){
            this._resize();
            this._playout();
        },
        _delegate:function(){
            var self = this;
            /**
            * mobile 不需要按钮
            */
            // $('#ul_'+this.id).delegate('li','click',function(e){
            //         clearTimeout(self.end);
            //         clearTimeout(self.star);
            //         self._playout();
            // });
        },
        _resize:function(){
            var self = this;
            var bool = false;
            window.addEventListener('resize',function(){
                if(!bool){
                    bool = true;
                    clearTimeout(self.end);
                    clearTimeout(self.star);
                    self.width = self.parent.width();
                    self.el.css({width:self.width*self.options.list});
                    self.child.css({width:self.width});
                    self._playout();
                    var time = setTimeout(function(){
                        bool = false;
                    },300);
                }
            });
            this._delegate();
        },
        _playout:function(){
            var self = this;
            setTimeout(function(){
                self.start(self.animate);
            },4000);
        },
        start:function(animate){
            var self = this;
            if(this.index === this.max){
              this.index--;
              this.end = setTimeout(function(){
                self.endMinus(animate);
              },4000)
              return false;
            }
            animate.reset(self.id, {left:'-'+self.width*this.index+ 'px'});
            animate.start();
            this.index ++;
            this.list.removeClass('hover');
            this.list.eq(this.index - 1).addClass('hover');
            this.star = setTimeout(function(){
               self.start(animate);
            },4000);
        },
        endMinus:function(animate){
            var self = this;
            if(this.index === 0){
                this.index++;
                this.star = setTimeout(function(){
                  self.start(animate);
                },4000);
                return false;
            }
            this.list.removeClass('hover');
            this.list.eq(this.index - 1).addClass('hover');
            this.index--
            animate.reset(self.id, {left:'-'+self.width*this.index+ 'px'});
            animate.start();
            this.end = setTimeout(function(){
              self.endMinus(animate);
            },4000);
        }
    }
    $.fn.banner = function(options){
        var $this = $(this);
        var data = $this.data('banner');
        if(!data) $this.data('banner',(data = new Banner($this,options)));
        if(typeof options === 'string') data[options].call($this);
    }
    $.fn.banner.Constructor = Banner;
})(Zepto);