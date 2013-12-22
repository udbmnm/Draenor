/*
* mobile ui verification 表单验证 Forms 依赖 zepto.js  作者：wenren
*/
(function($){
  var bool = true,muster = {}
  //验证
  var trigger = function(target,self,event){
      var elements = self.input,regx = self.options.regx;
      var i = 0,len = elements.length;
      for(;i<len;i++){
          var el = elements.eq(i);
          var value = el.val();
          if(value.length === 0){
              $.error.show(self.defaultmessage);
              $.error.hide();
              bool = false;
              break;
          }
          if(regx){
            var x = regx[i];
            if(x){
                if(!x.desc){
                    for(var c in x){
                        if(!x[c].test(value)){
                            $.error.show(c);
                            $.error.hide();
                            bool = false;
                            break;
                        }
                        bool = true;
                    }
                    if(!bool){
                      break;
                    }
                }
            }
          }
          bool = true;
          muster[el.attr('data-key')] = value; 
      }
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
      var type = this.options.type ||'tap';
      var submitE = $(this.options.submitElements);
      var Self = this;
      this.defaultmessage = options.defaultmessage || '账户或密码不能为空';
      submitE.on(type,function(event){
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
})(Zepto);