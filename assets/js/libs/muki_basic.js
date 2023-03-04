/*-----------------------------------------------------------------------------*/
/**
 * 取得裝置資訊
 *
 * @Class GetMobileInfo
 */
function GetMobileInfo() {
	this.initialize.apply(this, arguments);
}

GetMobileInfo.prototype = Object.create(Interface.prototype);
GetMobileInfo.constructor = GetMobileInfo;

GetMobileInfo.prototype.initialize = function(callBack) {
	Interface.prototype.initialize.call(this, callBack);
}

GetMobileInfo.prototype.iOS = function() {
	this._function = 'mukiGetAppInfo';
	this.iBridge();
}

GetMobileInfo.prototype.android = function() {
	this.androidBridge();
	if( window.JS ){
		window.JS.getAppInfo(this._data[0]);
	}
}

/*-----------------------------------------------------------------------------*/
/**
 * 設定通知數字
 *
 * @Class SetBadgeNum
 */
function SetBadgeNum() {
	this.initialize.apply(this, arguments);
}

SetBadgeNum.prototype = Object.create(Interface.prototype);
SetBadgeNum.prototype.constructor = SetBadgeNum;

SetBadgeNum.prototype.initialize = function() {
	Interface.prototype.initialize.call(this);
}

SetBadgeNum.prototype.iOS = function() {
	this._function = 'mukiSetBadgeNum';
	this.iBridge();
}

SetBadgeNum.prototype.android = function() {
	if( window.JS ){
		window.JS.setBadgeNum(this._data[0]);
	}
}

/*-----------------------------------------------------------------------------*/
/**
 * 另開視窗
 *
 * @Class OpenWindow
 */
function OpenWindow() {
	this.initialize.apply(this, arguments);
}

OpenWindow.prototype = Object.create(Interface.prototype);
OpenWindow.prototype.constructor = OpenWindow;

OpenWindow.prototype.initialize = function() {
	Interface.prototype.initialize.call(this);
}

OpenWindow.prototype.iOS = function() {
	this._function = 'mukiShouldStartLoadWith';
	this.iBridge();
}

OpenWindow.prototype.android = function() {
	if( window.JS ){
		window.JS.shouldStartLoadWith(this._data[0]);
	}
}

OpenWindow.prototype.website = function() {
	window.open(this._data[0]);
}

/*-----------------------------------------------------------------------------*/
/**
 * 開啟瀏覽器
 *
 * @Class OpenBrowser
 */
function OpenBrowser() {
	this.initialize.apply(this, arguments);
}

OpenBrowser.prototype = Object.create(Interface.prototype);
OpenBrowser.prototype.constructor = OpenBrowser;

OpenBrowser.prototype.initialize = function() {
	Interface.prototype.initialize.call(this);
}

OpenBrowser.prototype.iOS = function() {
	this._function = 'mukiOpenUrlByBrowser';
	this.iBridge();
}

OpenBrowser.prototype.android = function() {
	if( window.JS ){
		window.JS.openUrlByBrowser(this._data[0]);
	}
}

OpenBrowser.prototype.website = function() {
	window.open(this._data[0]);
}

/*-----------------------------------------------------------------------------*/
/**
 * 原生訊息框
 *
 * @Class AlertDialog
 */
function AlertDialog() {
	this.initialize.apply(this, arguments);
}

AlertDialog.prototype = Object.create(Interface.prototype);
AlertDialog.prototype.constructor = AlertDialog;

AlertDialog.prototype.initialize = function() {
	Interface.prototype.initialize.call(this);
}

AlertDialog.prototype.iOS = function() {
	this._function = 'mukiAlertDialog';
	if(typeof this._data[2] === 'undefined'){
		this._data[2] = '確定';
	}
	this.iBridge();
}

AlertDialog.prototype.android = function() {
	if(typeof this._data[2] === 'undefined'){
		this._data[2] = '確定';
	}
	if( window.JS ){
		window.JS.alertDialog(this._data[0], this._data[1], this._data[2]);
	}
}

AlertDialog.prototype.website = function() {
	if(typeof this._data[0] !== 'undefined' && typeof this._data[1] !== 'undefined'){
		alert(this._data[0]+'\n'+this._data[1]);
	}
}

/*-----------------------------------------------------------------------------*/
/**
 * 原生提示
 *
 * @Class AlertToast
 */
function AlertToast() {
	this.initialize.apply(this, arguments);
}

AlertToast.prototype = Object.create(Interface.prototype);
AlertToast.prototype.constructor = AlertToast;

AlertToast.prototype.initialize = function() {
	Interface.prototype.initialize.call(this);
}

AlertToast.prototype.iOS = function() {
	this._function = 'mukiAlertToast';
	if(typeof this._data[1] === 'undefined'){
		this._data[1] = 'center';
	}
	if(typeof this._data[2] === 'undefined'){
		this._data[2] = 'short';
	}
	this.iBridge();
}

AlertToast.prototype.android = function() {
	if(typeof this._data[1] === 'undefined'){
		this._data[1] = 'center';
	}
	if(typeof this._data[2] === 'undefined'){
		this._data[2] = 'short';
	}

	if( window.JS ){
		window.JS.alertToast(this._data[0], this._data[1], this._data[2]);
	}
}

AlertToast.prototype.website = function() {
	alert(this._data[0]);
}

/*-----------------------------------------------------------------------------*/
/**
 * 開啟讀取效果
 *
 * @Class LoadingStart
 */
function LoadingStart() {
	this.initialize.apply(this, arguments);
}

LoadingStart.prototype = Object.create(Interface.prototype);
LoadingStart.prototype.constructor = LoadingStart;

LoadingStart.prototype.initialize = function() {
	Interface.prototype.initialize.call(this);
}

LoadingStart.prototype.iOS = function() {
	this._function = 'mukiStartLoading';
	this.iBridge();
}

LoadingStart.prototype.android = function() {
	if( window.JS ){
		window.JS.startLoading();
	}
}

/*-----------------------------------------------------------------------------*/
/**
 * 關閉讀取效果
 *
 * @Class LoadingStop
 */
function LoadingStop() {
	this.initialize.apply(this, arguments);
}

LoadingStop.prototype = Object.create(Interface.prototype);
LoadingStop.prototype.constructor = LoadingStop;

LoadingStop.prototype.initialize = function() {
	Interface.prototype.initialize.call(this);
}

LoadingStop.prototype.iOS = function() {
	this._function = 'mukiStopLoading';
	this.iBridge();
}

LoadingStop.prototype.android = function() {
	if( window.JS ){
		window.JS.stopLoading();
	}
}

/*-----------------------------------------------------------------------------*/
/**
 * 撥號
 *
 * @Class Dial
 */
function Dial() {
	this.initialize.apply(this, arguments);
}

Dial.prototype = Object.create(Interface.prototype);
Dial.prototype.constructor = Dial;

Dial.prototype.initialize = function() {
	Interface.prototype.initialize.call(this);
}

Dial.prototype.iOS = function() {
	this._function = 'mukiDial';
	this.iBridge();
}

Dial.prototype.android = function() {
	if( window.JS ){
		window.JS.dial(this._data[0]);
	}
}

/*-----------------------------------------------------------------------------*/
/**
 * 前往指定專案
 *
 * @Class ReachProject
 * only fo Android
 */
function ReachProject() {
	this.initialize.apply(this, arguments);
}

ReachProject.prototype = Object.create(Interface.prototype);
ReachProject.prototype.constructor = ReachProject;

ReachProject.prototype.initialize = function() {
	Interface.prototype.initialize.call(this);
}

ReachProject.prototype.android = function() {
	if( window.JS ){
		window.JS.goTestSite(this._data[0]);
	}
}

/*-----------------------------------------------------------------------------*/
/**
 * 定義虛擬返回鍵行為
 *
 * @Class SetBackAction
 * only fo Android
 */
function SetBackAction() {
	this.initialize.apply(this, arguments);
}

SetBackAction.prototype = Object.create(Interface.prototype);
SetBackAction.prototype.constructor = SetBackAction;

SetBackAction.prototype.initialize = function(callBack) {
	Interface.prototype.initialize.call(this, callBack);
}

/*待討論*/
SetBackAction.prototype.android = function() {
	if(typeof this._data[0] === 'undefined'){
		this._data[0] = 0;
	}

	if( window.JS ){
		if(this._data[0] == 0){
			window.JS.backAction(function() {
				this.android();
				if(typeof this._callBack !== 'function'){
					this._callBack();
				}
			});
		}
		else{
			window.JS.closeBackAction(function() {
				this.android();
			});
		}
	}
}

/*-----------------------------------------------------------------------------*/
/**
 * 返回特定頁面
 *
 * @Class GoBackUrl
 */
function GoBackUrl() {
	this.initialize.apply(this, arguments);
}

GoBackUrl.prototype = Object.create(Interface.prototype);
GoBackUrl.prototype.constructor = GoBackUrl;

GoBackUrl.prototype.initialize = function() {
	Interface.prototype.initialize.call(this);
}

GoBackUrl.prototype.iOS = function() {
	this._function = 'mukiGoBackUrl';
	if(typeof callBack === 'function'){
		this._callBack = callBack;
	}
	this.iBridge();
}

GoBackUrl.prototype.android = function() {
	if( window.JS ){
		window.JS.goBackUrl(this._data[0]);
	}
}

/*-----------------------------------------------------------------------------*/