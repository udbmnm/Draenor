/*
* mobile ui 地理位置 依赖 zepto.js  作者：wenren
*/
(function($){

	var throwError = function(status,message){
		$.geolocation = {
			"status":status,
			"message":message
		}
	} 
	var geolocation = function(){
  		if(navigator.geolocation){
  			navigator.geolocation.getCurrentPosition(function(options){
  				$.geolocation = {
  					"latitude":options.coords.latitude,
  					"longitude":options.coords.longitude
  				}
  			},function(error){
  				switch(error.code){
  					case 0:
  							throwError(0,error.message);
  						break;
  					case 1:
  							throwError(1,error.message);
  						break;
  					case 2:
  							throwError(2,error.message);
  						break;
  					case 3:
  							throwError(3,error.message);
  						break;
  				}
  			});
  		}
  	}
  	$.geolocation;
	$.geolocationSarat = function(bool){
		if(bool){
			if(navigator.geolocation){
				geolocation();
			}
		}
	}
})(Zepto);