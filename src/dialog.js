/*
* mobile ui dialog 对话框 依赖 zepto.js  作者：wenren
*/
(function($){
  var Dialog = function(dom,options){
      this.options = options;
  }
  Dialog.prototype = {
      /**
      * open dialog 
      * @method show
      */
      show:function(){          
          $.DOMcollection.backdrop.show();
          this.show();
      },
      /**
      * close dialog
      * @method hide
      */
      hide:function(){
          $.DOMcollection.backdrop.hide();
          this.hide();
      }
  }
  $.fn.dialog = function(options){
      return this.each(function(){
          var $this = $(this);
          var data = $this.data('dialog');
          if(!data){
              $this.data('dialog',(data = new Dialog($this,options)));
          }
          if(typeof options === 'string'){
              data[options].call($this);
          }
      });
  }
  $.fn.dialog.Constructor = Dialog
})(Zepto)