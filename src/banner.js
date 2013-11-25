/*
* mobile ui banner 依赖 zepto.js  作者：wenren
*/
(function($){
    var desc = false;
    var touchStart = function(self,animate){
        animate.reset(self.id, {left:'-'+self.width*self.index+ 'px'});
        animate.start();
        self.index++;
        self.list.removeClass('hover');
        self.list.eq(self.index - 1).addClass('hover'); 
    }
    var touchEnd = function(self,animate){
        self.list.removeClass('hover');
        self.list.eq(self.index - 1).addClass('hover');
        self.index--;
        animate.reset(self.id, {left:'-'+self.width*self.index+ 'px'});
        animate.start();
    }
    var Banner = function(id,options){
        this.id = id.attr('id');
        this.el = id;
        this.parent = this.el.parent();
        this.width = this.parent.width();
        this.options = options;
        this.el.css({width:this.width*this.options.list});
        if(this.options.template === undefined) { 
            this.child = this.el.children();         
            this.child.css({width:this.width});
        }else{
            this.create();
        }
        var list = '<ul id="ul_'+this.id+'" class="banner_btn">';
        for(var i = 0;i<this.options.list;i++){
            if(i === 0){
               list += '<li class="hover" data-list="'+(i+1)+'"></li>';
               continue;
            } 
            list += '<li data-list="'+(i+1)+'"></li>';
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
        create:function(){
            var render = template.compile(this.options.template);
            var createHTML = render({data:this.options.data});
            this.el.append(createHTML);
            this.child = this.el.children();  
            this.child.css({width:this.width});
        },
        _delegate:function(){
            var self = this;
            // this.el.delegate('div.banner','touchstart',function(){
            //     clearTimeout(self.end);
            //     clearTimeout(self.star);
            // });
            // this.el.delegate('div.banner','touchend',function(){

            // });
            // this.el.delegate('div.banner','touchmove',function(){

            // });
            /**
            * mobile 不需要按钮，用于测试
            */
            var bool = false;
            $('#ul_'+this.id).delegate('li','click',function(){
                clearTimeout(self.play);
                clearTimeout(self.end);
                clearTimeout(self.star);
                if(!bool){
                    bool = true;
                    self._touchPlay();
                    var time = setTimeout(function(){
                        bool = false;
                    },300);
                }                
            });
        },
        _resize:function(){
            var self = this;
            var bool = false;
            window.addEventListener('resize',function(){
                if(!bool){
                    bool = true;
                    clearTimeout(self.play);
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
            this.play = setTimeout(function(){
                self.start(self.animate);
            },4000);
        },
        _touchPlay:function(){
            var self = this;
            if(this.index === this.max){
                this.index--;
                desc = true;
            }
            if(this.index === 0){
                this.index++;
                desc = false;
            }
            if(desc){
                touchEnd(self,self.animate);
            }else{
                touchStart(self,self.animate);
            }
            this._playout();            
        },
        start:function(animate){
            var self = this;
            if(this.index === this.max){
              this.index--;
              this.end = setTimeout(function(){
                self.endMinus(animate);
              },4000);
              return false;
            }
            touchStart(self,self.animate);
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
            touchEnd(self,self.animate);
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