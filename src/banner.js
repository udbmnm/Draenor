/*
* mobile ui banner 依赖 zepto.js  作者：wenren
*/
(function($){
    var desc = false;
    /**
    *   @method touchStart
    *   @param self {object}
    *   @param animate {object}
    */
    var touchStart = function(self,animate){
        animate.reset(self.id, {left:'-'+self.width*self.index+ 'px'});
        animate.start();
        self.index++;
        self.list.removeClass('hover');
        self.list.eq(self.index - 1).addClass('hover'); 
    }
    /**
    *   @method touchEnd
    *   @param self {object}
    *   @param animate {object}
    */
    var touchEnd = function(self,animate){
        self.list.removeClass('hover');
        self.list.eq(self.index - 1).addClass('hover');
        self.index--;
        animate.reset(self.id, {left:'-'+self.width*self.index+ 'px'});
        animate.start();
    }
    /**
    *   @class Banner
    *   @param dom {dom object}
    *   @param options {options object}
    */
    var Banner = function(dom,options){
        this.id = dom.attr('id');
        this.el = dom;
        this.parent = this.el.parent();
        this.width = this.parent.width();
        this.options = options;
        this.el.css({width:this.width*this.options.list});
        if(this.options.template === undefined) { 
            this.child = this.el.children();
            this.height = this.el.find('img').height()/this.options.list;
            this.parent.css({height:this.height});
            this.child.css({width:this.width});
        }else{
            this.create();
        }
        var list = '<ul id="ul_'+this.id+'" class="banner_scroll">';
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
        this.index = 1;
        this.max = this.options.list;
        this.animate = new jsMorph();
        this.resize();
        // this.begin()
    }
    Banner.prototype = {
        create:function(){
            var render = template.compile(this.options.template);
            var createHTML = render({data:this.options.data});
            this.el.append(createHTML);
            this.child = this.el.children();
            this.height = this.el.find('img').height()/this.options.list;
            this.parent.css({height:this.height});  
            this.child.css({width:this.width});
        },
        delegate:function(){
            var self = this;
            var bool = false;
            this.el.delegate('div.banner','touchstart',function(){
                clearTimeout(self.play);
                clearTimeout(self.end);
                clearTimeout(self.star);
            });
            // this.el.delegate('div.banner','touchend',function(){
                
            // });
            this.el.delegate('div.banner','touchmove',function(){
                if(!bool){
                    bool = true;
                    self.touchbegin();
                    var time = setTimeout(function(){
                        bool = false;
                    },300);
                }
            });
            /**
            * mobile 不需要按钮，用于测试
            */            
            // $('#ul_'+this.id).delegate('li','click',function(){
            //     clearTimeout(self.play);
            //     clearTimeout(self.end);
            //     clearTimeout(self.star);
            //     if(!bool){
            //         bool = true;
            //         self.touchbegin();
            //         var time = setTimeout(function(){
            //             bool = false;
            //         },300);
            //     }                
            // });
        },
        resize:function(){
            var self = this;
            var bool = false;
            window.addEventListener('resize',function(){
                if(!bool){
                    bool = true;
                    clearTimeout(self.play);
                    clearTimeout(self.end);
                    clearTimeout(self.star);
                    self.width = self.parent.width();
                    console.log(self.el.find('img').height());
                    self.height = self.el.find('img').height();
                    self.parent.css({height:self.height});  
                    self.el.css({width:self.width*self.options.list});
                    self.child.css({width:self.width});
                    self.begin();
                    var time = setTimeout(function(){
                        bool = false;
                    },300);
                }
            });
            this.delegate();
        },
        begin:function(){
            var self = this;
            this.play = setTimeout(function(){
                self.startAdd(self.animate);
            },4000);
        },
        touchbegin:function(){
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
            this.begin();            
        },
        startAdd:function(animate){
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
               self.startAdd(animate);
            },4000);
        },
        endMinus:function(animate){
            var self = this;
            if(this.index === 0){
                this.index++;
                this.star = setTimeout(function(){
                  self.startAdd(animate);
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
    }
    $.fn.banner.Constructor = Banner;
})(Zepto);