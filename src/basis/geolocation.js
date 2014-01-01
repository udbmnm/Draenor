/*
* mobile modules 地理位置 依赖 zepto.js  作者：wenren
*/
(function($){
	var throwError = function(status,message,callback){
		var geolocation = {
			"status":status,
			"message":message
		}
    $.storage.set('geolocation',$.stringify(geolocation));
    if(typeof callback === 'function') callback(geolocation);
	} 
	var getCurrentPosition = function(callback){
  		if(navigator.geolocation){
  			navigator.geolocation.getCurrentPosition(function(options){
  				var geolocation = {
  					"latitude":options.coords.latitude,
  					"longitude":options.coords.longitude
  				}
          $.storage.set('geolocation',$.stringify(geolocation));
          if(typeof callback === 'function') callback(geolocation);
  			},function(error){
  				switch(error.code){
  					case 0:
  							throwError(0,error.message,callback);
  						break;
  					case 1:
  							throwError(1,error.message,callback);
  						break;
  					case 2:
  							throwError(2,error.message,callback);
  						break;
  					case 3:
  							throwError(3,error.message,callback);
  						break;
  				}
  			});
  		}
  	}

	$.geolocationSarat = function(bool,callback){
		if(bool){
			if(navigator.geolocation){
				getCurrentPosition(callback);
			}
		}
	}
})(Zepto);