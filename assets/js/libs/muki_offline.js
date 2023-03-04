/*-----------------------------------------------------------------------------*/
/**
 * 傳送離線網頁資料
 *
 * @Class TransferWebData
 */
function TransferWebData() {
	this.initialize.apply(this, arguments);
}

TransferWebData.prototype = Object.create(Interface.prototype);
TransferWebData.prototype.constructor = TransferWebData;

TransferWebData.prototype.initialize = function(callBack) {
	Interface.prototype.initialize.call(this, callBack);
}

TransferWebData.prototype.iOS = function() {
	this._function = 'mukiTransferWebData';
	this.iBridge();
}

TransferWebData.prototype.android = function() {
	this.androidBridge();
	if( window.JS ){
		window.JS.transferWebData(this._data[0], this._data[1], this._data[2]);
	}
}

TransferWebData.prototype.website = function() {
	if(typeof this._callBack === 'function'){
		var dataList = {res_code: 0};
    	this._callBack(dataList);
    }
}

/*-----------------------------------------------------------------------------*/
/**
 * 取得上次傳送離線網頁檔案時間
 *
 * @Class GetTransferDatetime
 */
function GetTransferDatetime() {
	this.initialize.apply(this, arguments);
}

GetTransferDatetime.prototype = Object.create(Interface.prototype);
GetTransferDatetime.prototype.constructor = GetTransferDatetime;

GetTransferDatetime.prototype.initialize = function(callBack) {
	Interface.prototype.initialize.call(this, callBack);
}

GetTransferDatetime.prototype.iOS = function() {
	this._function = 'mukiGetTransferDatetime';
	this.iBridge();
}

GetTransferDatetime.prototype.android = function() {
	this.androidBridge();
	if( window.JS ){
		window.JS.getTransferDatetime(this._data[0]);
	}
}

GetTransferDatetime.prototype.website = function() {
	if(typeof this._callBack === 'function'){
		var dataList = {res_code: 0};
    	this._callBack(dataList);
    }
}

/*-----------------------------------------------------------------------------*/
/**
 * 判斷離線網頁檔案是否存在
 *
 * @Class IsExsitWebData
 */
function IsExsitWebData() {
	this.initialize.apply(this, arguments);
}

IsExsitWebData.prototype = Object.create(Interface.prototype);
IsExsitWebData.prototype.constructor = IsExsitWebData;

IsExsitWebData.prototype.initialize = function(callBack) {
	Interface.prototype.initialize.call(this, callBack);
}

IsExsitWebData.prototype.iOS = function() {
	this._function = 'mukiIsExsitFile';
	this.iBridge();
}

IsExsitWebData.prototype.android = function() {
	this.androidBridge();
	if( window.JS ){
		window.JS.isExsitFile(this._data[0], this._data[1]);
	}
}

/*-----------------------------------------------------------------------------*/
/**
 * 傳輸變數
 *
 * @Class TransferVariable
 */
function TransferVariable() {
	this.initialize.apply(this, arguments);
}

TransferVariable.prototype = Object.create(Interface.prototype);
TransferVariable.prototype.constructor = TransferVariable;

TransferVariable.prototype.initialize = function(callBack) {
	Interface.prototype.initialize.call(this, callBack);
}

TransferVariable.prototype.iOS = function() {
	this._function = 'mukiTransferVariable';
	this.iBridge();
}

TransferVariable.prototype.android = function() {
	this.androidBridge();
	if( window.JS ){
		window.JS.transferVariable(this._data[0], this._data[1], this._data[2]);
	}
}

TransferVariable.prototype.website = function() {
	if(typeof this._callBack === 'function'){
		var dataList = {res_code: 0};
    	this._callBack(dataList);
    }
}

/*-----------------------------------------------------------------------------*/
/**
 * 取得變數
 *
 * @Class GetVariable
 */
function GetVariable() {
	this.initialize.apply(this, arguments);
}

GetVariable.prototype = Object.create(Interface.prototype);
GetVariable.prototype.constructor = GetVariable;

GetVariable.prototype.initialize = function(callBack) {
	Interface.prototype.initialize.call(this, callBack);
}

GetVariable.prototype.iOS = function() {
	this._function = 'mukiGetVariable';
	this.iBridge();
}

GetVariable.prototype.android = function() {
	this.androidBridge();
	if( window.JS ){
		window.JS.getVariable(this._data[0], this._data[1]);
	}
}

GetVariable.prototype.website = function() {
	if(typeof this._callBack === 'function'){
		var dataList = {res_code: 0};
    	this._callBack(dataList);
    }
}

/*-----------------------------------------------------------------------------*/