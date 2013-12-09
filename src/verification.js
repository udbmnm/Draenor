/*
* mobile ui verification 表单验证 Forms 依赖 zepto.js  作者：wenren
*/
(function($){
  var bool = true,muster = {}
  var trigger = function(target,self,event){
      var elements = self.input;
      var regx = self.options.regx;
      elements.forEach(function(v,i){
          var el = elements.eq(i);
          var value = el.val();
          if(value.length === 0){
              $.error.show('账户或密码不能为空');
              setTimeout(function(){$.error.hide();},2000);
              bool = false;
              return false;
          }
          if($.type(regx)==='object'){
              for(var x in regx){
                  if(!regx[x].test(value)){
                      $.error.show(x);
                      setTimeout(function(){$.error.hide();},2000);
                      bool = false;
                      break;
                  }
              }
              if(!bool){
                  return false;
              }
          }
          bool = true;
          muster[el.attr('data-key')] = value;
      });
      if(bool){
          self.options.affairFun.call(target,muster,event);
      }
  }
  /**
  *   Verification forms input
  *   @class Verification
  *   @param id {document object}
  *   @param options {object}
  */
  var Verification = function(dom,options){
      this.dom = dom,this.id = dom.attr('id'),this.options = options;
      this.input = this.dom.find('input');
      var type = 'tap' || this.options.type;
      var submitE = document.querySelector(this.options.submitElements);
      var Self = this;
      $.Hammer(submitE).on(type,function(event){
          trigger(this,Self,event);
      });
  }
  $.fn.verification = function(options,callback){
      return this.each(function(){
          var $this = $(this);
          var data = $this.data('verification');
          if(!data){
              $this.data('verification',(data = new Verification($this,options)));
          }
      });
  }
  $.fn.verification.Constructor = Verification;
})(Zepto)