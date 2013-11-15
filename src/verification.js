/*
* mobile ui verification Forms 依赖 zepto.js  作者：wenren
*/
(function($){
  var body = $('body');
  var err = '<div id="error" class="error" style="display:none;"></div>';  
  body.append(err);
  var error = $('#error'),message,tacit;
  /**
  *   Verification forms input
  *   @class Verification
  *   @param id {document object}
  *   @param options {object}
  */
  var Verification = function(id,options){
      this.id = id;
      this.options = options;
      this.input = this.id.find('input');
      this.error = undefined;
  }
  Verification.prototype = {
      /**
      *   @method trigger
      *   @param callback {function}
      */
      trigger:function(callback){
          var self = this;
          var more = function(){
              $.each(self.input,function(i){
                  var v = self.input.eq(i).val();
                  if(v.length === 0){
                      message = self.input.eq(i);
                      tacit = true;
                      return false;
                  }
                  if(self.options.regx !== undefined){
                      if(!self.options.regx.test(v)){
                          message = self.input.eq(i);
                          tacit = false;
                          return false;
                      }
                  }
              });
              return message;
          }
          var less = function(){
              value.push(self.input.val());
          }
          this.input.length !== 0 ? this.error = more() : this.error = less();
          if(this.options.focus && this.error !== undefined) this.error.focus();
          this.error !== undefined ? callback(false,this.error,tacit) : callback(true);
      }
  }
  $.fn.verification = function(options,callback){
      return this.each(function(){
          var $this = $(this);
          var data = $this.data('verification');
          if(!data){
              $this.data('verification',(data = new Verification($this,options)));
          }
          if(typeof options === 'string'){
              data[options](callback);
          }
      });
  }
  $.fn.verification.Constructor = Verification;
})(Zepto)