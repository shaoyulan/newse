/*-----------------------------------------------------------------------------*/
/**
 * 從 facebook 登入
 *
 * @Class LoginByFacebook
 */
function LoginByFacebook() {
	this.initialize.apply(this, arguments);
}

LoginByFacebook.prototype = Object.create(Interface.prototype);
LoginByFacebook.prototype.constructor = LoginByFacebook;

LoginByFacebook.prototype.initialize = function(callBack) {
	Interface.prototype.initialize.call(this, callBack);
}

LoginByFacebook.prototype.iOS = function() {
	this._function = 'mukiLoginViaFB';
	this.iBridge();
}

LoginByFacebook.prototype.android = function() {
	this.androidBridge();
	if( window.JS ){
		window.JS.loginViaFB(this._data[0]);
	}
}

/*-----------------------------------------------------------------------------*/
/**
 * 從 Line 登入
 *
 * @Class LoginByLine
 */
function LoginByLine() {
	this.initialize.apply(this, arguments);
}

LoginByLine.prototype = Object.create(Interface.prototype);
LoginByLine.prototype.constructor = LoginByLine;

LoginByLine.prototype.initialize = function(callBack) {
	Interface.prototype.initialize.call(this, callBack);
}

LoginByLine.prototype.iOS = function() {
	this._function = 'mukiLoginViaLINE';
	this.iBridge();
}

LoginByLine.prototype.android = function() {
	this.androidBridge();
	if( window.JS ){
		window.JS.loginViaLINE(this._data[0]);
	}
}

/*-----------------------------------------------------------------------------*/