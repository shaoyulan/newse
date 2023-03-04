/*-----------------------------------------------------------------------------*/
/**
 * 開啟 QR Code 掃描器
 *
 * @Class OpenScan
 */
function OpenScan() {
	this.initialize.apply(this, arguments);
}

OpenScan.prototype = Object.create(Interface.prototype);
OpenScan.prototype.constructor = OpenScan;

OpenScan.prototype.initialize = function(callBack) {
	Interface.prototype.initialize.call(this, callBack);
}

OpenScan.prototype.iOS = function() {
	this._function = 'mukiOpenScan';
	this.iBridge();
}

OpenScan.prototype.android = function() {
	this.androidBridge();
	if( window.JS ){
		window.JS.openScan(this._data[0], this._data[1]);
	}
}

/*-----------------------------------------------------------------------------*/
/**
 * 取得螢幕亮度設定值
 *
 * @Class GetBrightness
 */
function GetBrightness() {
	this.initialize.apply(this, arguments);
}

GetBrightness.prototype = Object.create(Interface.prototype);
GetBrightness.prototype.constructor = GetBrightness;

GetBrightness.prototype.initialize = function(callBack) {
	Interface.prototype.initialize.call(this, callBack);
}

GetBrightness.prototype.iOS = function() {
	this._function = 'mukiGetBrightness';
	this.iBridge();
}

GetBrightness.prototype.android = function() {
	this.androidBridge();
	if( window.JS ){
		window.JS.getBrightness(this._data[0]);
	}
}

/*-----------------------------------------------------------------------------*/
/**
 * 設定螢幕亮度
 *
 * @Class SetBrightness
 */
function SetBrightness() {
	this.initialize.apply(this, arguments);
}

SetBrightness.prototype = Object.create(Interface.prototype);
SetBrightness.prototype.constructor = SetBrightness;

SetBrightness.prototype.initialize = function() {
	Interface.prototype.initialize.call(this);
}

SetBrightness.prototype.iOS = function() {
	this._function = 'mukiSetBrightness';
	this.iBridge();
}

SetBrightness.prototype.android = function() {
	if( window.JS ){
		window.JS.setBrightness(this._data[0]);
	}
}

/*-----------------------------------------------------------------------------*/
/**
 * 設定指紋/臉部辨識
 *
 * @Class SetFingerprint
 */
function SetFingerprint() {
	this.initialize.apply(this, arguments);
}

SetFingerprint.prototype = Object.create(Interface.prototype);
SetFingerprint.prototype.constructor = SetFingerprint;

SetFingerprint.prototype.initialize = function() {
	Interface.prototype.initialize.call(this);
}

SetFingerprint.prototype.iOS = function() {
	this._function = 'mukiIsFingerprint';
	this.iBridge();
}

SetFingerprint.prototype.android = function() {
	if( window.JS ){
		window.JS.isFingerprint(this._data[0]);
	}
}

/*-----------------------------------------------------------------------------*/
/**
 * 呼叫指紋/臉部辨識
 *
 * @Class CallFingerprint
 */
function CallFingerprint() {
	this.initialize.apply(this, arguments);
}

CallFingerprint.prototype = Object.create(Interface.prototype);
CallFingerprint.prototype.constructor = CallFingerprint;

CallFingerprint.prototype.initialize = function(callBack) {
	Interface.prototype.initialize.call(this, callBack);
}

CallFingerprint.prototype.iOS = function() {
	this._function = 'mukiOpenFingerprint';
	this.iBridge();
}

CallFingerprint.prototype.android = function() {
	this.androidBridge();
	if( window.JS ){
		window.JS.openFingerprint(this._data[0]);
	}
}

/*-----------------------------------------------------------------------------*/
/**
 * 開啟搖一搖
 *
 * @Class OpenShake
 */
function OpenShake() {
	this.initialize.apply(this, arguments);
}

OpenShake.prototype = Object.create(Interface.prototype);
OpenShake.prototype.constructor = OpenShake;

OpenShake.prototype.initialize = function(callBack) {
	Interface.prototype.initialize.call(this, callBack);
}

OpenShake.prototype.iOS = function() {
	this._function = 'mukiOpenShake';
	this.iBridge();
}

OpenShake.prototype.android = function() {
	this.androidBridge();
	if( window.JS ){
		window.JS.openShake(this._data[0]);
	}
}

/*-----------------------------------------------------------------------------*/
/**
 * 關閉搖一搖
 *
 * @Class CloseShake
 */
function CloseShake() {
	this.initialize.apply(this, arguments);
}

CloseShake.prototype = Object.create(Interface.prototype);
CloseShake.prototype.constructor = CloseShake;

CloseShake.prototype.initialize = function(callBack) {
	Interface.prototype.initialize.call(this, callBack);
}

CloseShake.prototype.iOS = function() {
	this._function = 'mukiCloseShake';
	this.iBridge();
}

CloseShake.prototype.android = function() {
	this.androidBridge();
	if( window.JS ){
		window.JS.closeShake(this._data[0]);
	}
}

/*-----------------------------------------------------------------------------*/