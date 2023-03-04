/*-----------------------------------------------------------------------------*/
/**
 * 開啟內建分享
 *
 * @Class OpenShare
 */
function OpenShare() {
	this.initialize.apply(this, arguments);
}

OpenShare.prototype = Object.create(Interface.prototype);
OpenShare.prototype.constructor = OpenShare;

OpenShare.prototype.initialize = function() {
	Interface.prototype.initialize.call(this);
}

OpenShare.prototype.iOS = function() {
	this._function = 'mukiOpenShare';
	this.iBridge();
}

OpenShare.prototype.android = function() {
	if( window.JS ){
		window.JS.openShare(this._data[0]);
	}
}

/*-----------------------------------------------------------------------------*/
/**
 * 分享到 facebook
 *
 * @Class ShareToFacebook
 */
function ShareToFacebook() {
	this.initialize.apply(this, arguments);
}

ShareToFacebook.prototype = Object.create(Interface.prototype);
ShareToFacebook.prototype.constructor = ShareToFacebook;

ShareToFacebook.prototype.initialize = function() {
	Interface.prototype.initialize.call(this);
}

ShareToFacebook.prototype.iOS = function() {
	this._function = 'mukiShareByFacebook';
	this.iBridge();
}

ShareToFacebook.prototype.android = function() {
	if( window.JS ){
		window.JS.shareByFacebook(this._data[0]);
	}
}

ShareToFacebook.prototype.website = function() {
	window.open('https://www.facebook.com/sharer/sharer.php?u=' + this._data[0]);
	//window.open('https://www.facebook.com/sharer/sharer.php?src=sdkpreparse&u=' + this._data[0]);
}

/*-----------------------------------------------------------------------------*/
/**
 * 分享到 LINE
 *
 * @Class ShareToLine
 */
function ShareToLine() {
	this.initialize.apply(this, arguments);
}

ShareToLine.prototype = Object.create(Interface.prototype);
ShareToLine.prototype.constructor = ShareToLine;

ShareToLine.prototype.initialize = function() {
	Interface.prototype.initialize.call(this);
}

ShareToLine.prototype.iOS = function() {
	this._function = 'mukiShareByLine';
	this.iBridge();
}

ShareToLine.prototype.android = function() {
	if( window.JS ){
		window.JS.shareByLine(this._data[0]);
	}
}

ShareToLine.prototype.website = function() {
	window.open('http://line.naver.jp/R/msg/text/?' + this._data[0]);
}

/*-----------------------------------------------------------------------------*/