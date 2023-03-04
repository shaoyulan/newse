/*-----------------------------------------------------------------------------*/
/**
 * 傳送要存放到本地的檔案
 *
 * @Class TransferFilesList
 */
function TransferFilesList() {
	this.initialize.apply(this, arguments);
}

TransferFilesList.prototype = Object.create(Interface.prototype);
TransferFilesList.prototype.constructor = TransferFilesList;

TransferFilesList.prototype.initialize = function(callBack) {
	Interface.prototype.initialize.call(this, callBack);
}

TransferFilesList.prototype.iOS = function() {
	this._function = 'mukiGetDownloadList';
	this.iBridge();
}

TransferFilesList.prototype.android = function() {
	this.androidBridge();
	if( window.JS ){
		window.JS.getDownloadList(this._data[0], this._data[1]);
	}
}

/*-----------------------------------------------------------------------------*/
/**
 * 取得全部本地檔案大小
 *
 * @Class GetFilesSize
 */
function GetFilesSize() {
	this.initialize.apply(this, arguments);
}

GetFilesSize.prototype = Object.create(Interface.prototype);
GetFilesSize.prototype.constructor = GetFilesSize;

GetFilesSize.prototype.initialize = function(callBack) {
	Interface.prototype.initialize.call(this, callBack);
}

GetFilesSize.prototype.iOS = function() {
	this._function = 'mukiGetFilesSize';
	this.iBridge();
}

GetFilesSize.prototype.android = function() {
	this.androidBridge();
	if( window.JS ){
		window.JS.getFilesSize(this._data[0]);
	}
}

/*-----------------------------------------------------------------------------*/
/**
 * 判斷本地檔案是否存在
 *
 * @Class IsExsitFile
 */
function IsExsitFile() {
	this.initialize.apply(this, arguments);
}

IsExsitFile.prototype = Object.create(Interface.prototype);
IsExsitFile.prototype.constructor = IsExsitFile;

IsExsitFile.prototype.initialize = function(callBack) {
	Interface.prototype.initialize.call(this, callBack);
}

IsExsitFile.prototype.iOS = function() {
	this._function = 'mukiIsFile';
	this.iBridge();
}

IsExsitFile.prototype.android = function() {
	this.androidBridge();
	if( window.JS ){
		window.JS.isFile(this._data[0], this._data[1]);
	}
}

/*-----------------------------------------------------------------------------*/
/**
 * 開啟本地檔案
 *
 * @Class OpenFile
 */
function OpenFile() {
	this.initialize.apply(this, arguments);
}

OpenFile.prototype = Object.create(Interface.prototype);
OpenFile.prototype.constructor = OpenFile;

OpenFile.prototype.initialize = function(callBack) {
	Interface.prototype.initialize.call(this, callBack);
}

OpenFile.prototype.iOS = function() {
	this._function = 'mukiOpenFile';
	this.iBridge();
}

OpenFile.prototype.android = function() {
	this._data[1] = this._data[1].replace(window.location.origin, '');
	if( window.JS ){
		window.JS.openFile(this._data[1] + this._data[0]);
	}
}

OpenFile.prototype.website = function() {
	if(typeof this._data[0] !== 'undefined' && typeof this._data[1] !== 'undefined'){
		document.body.innerHTML += '<a href="' + this._data[1] + this._data[0] + '" target="_blank" id="openFile"></a>';
		document.getElementById('openFile').setAttribute('download', this._data[0]);
		document.getElementById('openFile').click();
		document.getElementById('openFile').parentNode.removeChild(document.getElementById('openFile'));
	}
}

/*-----------------------------------------------------------------------------*/
/**
 * 下載檔案
 *
 * @Class DownloadFile
 */
function DownloadFile() {
	this.initialize.apply(this, arguments);
}

DownloadFile.prototype = Object.create(Interface.prototype);
DownloadFile.prototype.constructor = DownloadFile;

DownloadFile.prototype.initialize = function(callBack) {
	Interface.prototype.initialize.call(this, callBack);
}

DownloadFile.prototype.iOS = function() {
	this._function = 'mukiDownloadFile';
	this.iBridge();
}

DownloadFile.prototype.android = function() {
	if( window.JS ){
		window.JS.downloadFile(this._data[1] + this._data[0]);
	}
}

DownloadFile.prototype.website = function() {
	if(typeof this._data[0] !== 'undefined' && typeof this._data[1] !== 'undefined'){
		document.body.innerHTML += '<a href="' + this._data[1] + this._data[0] + '" target="_blank" id="downloadFile"></a>';
		document.getElementById('downloadFile').setAttribute('download', this._data[0]);
		document.getElementById('downloadFile').click();
		document.getElementById('downloadFile').parentNode.removeChild(document.getElementById('downloadFile'));
	}
}

/*-----------------------------------------------------------------------------*/
/**
 * 刪除本地檔案
 *
 * @Class DeleteFile
 */
function DeleteFile() {
	this.initialize.apply(this, arguments);
}

DeleteFile.prototype = Object.create(Interface.prototype);
DeleteFile.prototype.constructor = DeleteFile;

DeleteFile.prototype.initialize = function() {
	Interface.prototype.initialize.call(this);
}

DeleteFile.prototype.iOS = function() {
	this._function = 'mukiDeleteSingleFile';
	this.iBridge();
}

DeleteFile.prototype.android = function() {
	if( window.JS ){
		window.JS.deleteSingleFile(this._data[1] + this._data[0]);
	}
}

/*-----------------------------------------------------------------------------*/
/**
 * 刪除全部本地檔案
 *
 * @Class DeleteAllFiles
 */
function DeleteAllFiles() {
	this.initialize.apply(this, arguments);
}

DeleteAllFiles.prototype = Object.create(Interface.prototype);
DeleteAllFiles.prototype.constructor = DeleteAllFiles;

DeleteAllFiles.prototype.initialize = function() {
	Interface.prototype.initialize.call(this);
}

DeleteAllFiles.prototype.iOS = function() {
	this._function = 'mukiDeleteAllFiles';
	this.iBridge();
}

DeleteAllFiles.prototype.android = function() {
	if( window.JS ){
		window.JS.deleteAllFiles();
	}
}

/*-----------------------------------------------------------------------------*/
/**
 * 上傳檔案
 *
 * @class UploadFile
 */
function UploadFile() {
	this.initialize.apply(this, arguments);
}

UploadFile.prototype = Object.create(Interface.prototype);
UploadFile.prototype.constructor = UploadFile;

UploadFile.prototype.initialize = function(callBack) {
	Interface.prototype.initialize.call(this, callBack);
}

UploadFile.prototype.iOS = function() {
	this._function = 'mukiUploadFile';
	this.iBridge();
}

UploadFile.prototype.android = function() {
	this.androidBridge();
	if( window.JS ){
		window.JS.uploadFile(this._data[0], this._data[1]);
	}
}

/*-----------------------------------------------------------------------------*/