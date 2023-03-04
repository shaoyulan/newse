/**
 * 介接所有APP功能的基本類別
 *
 * @Class Interface
 */
function Interface() {
	this.initialize.apply(this, arguments);
}

Interface.prototype.initialize = function(callBack) {
	if(! window.Promise ){
		var head = document.getElementsByTagName('head')[0];
	    var scriptTag = document.createElement('script');
	    scriptTag.type= 'text/javascript';
	    scriptTag.onload = scriptTag.onreadystatechange = function() {
			if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
				scriptTag.onload = scriptTag.onreadystatechange = null;
			}
	    };
	    scriptTag.src= '/assets/js/common/polyfill.min.js';
	    head.appendChild(scriptTag);
	}

	this.clear();

	if(typeof callBack === 'function'){
		this._callBack = callBack;
	}
}

Interface.prototype.clear = function() {
	this._data = new Array();
}

Interface.prototype.value = function(key) {
	return this._data[key];
}

Interface.prototype.setValue = function(key, value) {
	this._data[key] = value;
}

Interface.prototype.getValue = function() {
	return this._data;
}

Interface.prototype.isValue = function(key) {
	return !!this._data[key];
}

Interface.prototype.setConfig = function(object) {
	var idx = 0;
	for(var key in object){
		this.setValue(idx, object[key]);
		idx++;
	}
}

Interface.prototype.deviceType = function() {
	var device_type = 0;
    /*if(/(Android)/i.test( window.navigator.userAgent )) {*/
    if(/(AndroidMuki)/i.test(window.navigator.userAgent)) {
        device_type = 1;
    }
    /*else if(/(iPhone|iPad|iPod|iOS)/i.test( window.navigator.userAgent )) {*/
	else if(/(IosMuki)/i.test( window.navigator.userAgent )) {
        device_type = 2;
    }
    return device_type;
}

Interface.prototype.getFunctionName = function(func){
	return func.name || func.toString().match(/function\s*([^(]*)\(/)[1];
}

Interface.prototype.iOS = function() {

}

Interface.prototype.iBridge = function() {
	if(typeof this._callBack === 'function'){
		var functionName = this.getFunctionName(this._callBack);
		this._data.splice(0, 0, functionName);
	}

	var command = {
		'command': Object.assign({}, this._data)
	};
	if ( window.webkit ){
    	window.webkit.messageHandlers.nativeMethod.postMessage({ body: command, FuncName: this._function });
	}
}

Interface.prototype.android = function() {

}

Interface.prototype.androidBridge = function() {
	if(typeof this._callBack === 'function'){
		var functionName = this.getFunctionName(this._callBack);
		this._data.splice(0, 0, functionName);
	}
}

function jsHandlerFunc(message, call_back) {
    /*message 型態字典，call_back 回傳參數*/
    call_back(message);
}

Interface.prototype.website = function() {

}

Interface.prototype.dcloud = function() {
	if( window.plus ){
		if(this.deviceType() == 1){
			if( window.plus.androidHandler ){

            }
		}
		else if(this.deviceType() == 2){
			if( window.plus.iosHandler ){

            }
		}
	}
}

Interface.prototype.action = function(config) {
	if(typeof config !== 'undefined'){
		this.setConfig(config);
	}

	if(this.deviceType() == 1){
		this.android();
	}
	else if(this.deviceType() == 2){
		this.iOS();
	}
	else{
		this.website();
	}
}

/*-----------------------------------------------------------------------------*/