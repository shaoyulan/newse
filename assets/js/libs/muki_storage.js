/**
 * 管理瀏覽器儲存的靜態類
 */
function Storage() {
	//throw new Error('This is a static class');
}

var $dataSession = null;
var $dataLocal = null;
var $dataWeb = null;
var $dataTable = null;

Storage._lockKey = 'mukiStorage';
Storage._isLock = true; /*資料是否加密*/

Storage.ready = function(call_back) {
	function setScript(scriptSrc, callback) {
		var head = document.getElementsByTagName('head')[0];

	    var scriptTag = document.createElement('script');
	    scriptTag.type= 'text/javascript';
	    scriptTag.onload = scriptTag.onreadystatechange = function() {
			if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
				if(typeof callback === 'function'){
					callback();
				}

				scriptTag.onload = scriptTag.onreadystatechange = null;
			}
	    };
	    scriptTag.src= scriptSrc;
	    head.appendChild(scriptTag);
	}
	if(! window.CryptoJS ){
    	setScript('/plugin/crypto-js/crypto-js.js', function(){
    		setScript('/plugin/crypto-js/lib-typedarrays.js', function(){
    			setScript('/plugin/crypto-js/aes.js', function(){
    				if(typeof call_back === 'function'){
    					call_back();
    				}
    			});
    		});
    	});
    }
    else{
    	if(typeof call_back === 'function'){
			call_back();
		}
    }
}

/*加密*/
Storage.encryptData = function(decrypted) {
	return new Promise(function(resolve, reject) {
		Storage.ready(function(){
			function encrypt(decrypted){
				function padRight(str, lenght) {
					if(str.length >= lenght)
				        return str;
				    else
				        return padRight(str+"0",lenght);
				}
				var key = iv = window.CryptoJS.enc.Utf8.parse(padRight(Storage._lockKey, 32));

			    var opinion = {iv: iv, mode: window.CryptoJS.mode.CBC, padding: window.CryptoJS.pad.Pkcs7};
			    var encrypted = window.CryptoJS.AES.encrypt(decrypted, key, opinion);

			    return encrypted.toString();
			}
			resolve(encrypt(decrypted));
		});
	});
}

/*解密*/
Storage.decryptData = function(encrypted) {
	return new Promise(function(resolve, reject) {
		Storage.ready(function(){
			function decrypt(encrypted){
				function padRight(str, lenght) {
					if(str.length >= lenght)
				        return str;
				    else
				        return padRight(str+"0",lenght);
				}
				var key = iv = window.CryptoJS.enc.Utf8.parse( padRight(Storage._lockKey, 32) );

			    var opinion = {iv: iv, mode:CryptoJS.mode.CBC, padding: window.CryptoJS.pad.Pkcs7};
			    var decrypted = window.CryptoJS.AES.decrypt(encrypted, key, opinion);
			    decrypted = decrypted.toString( window.CryptoJS.enc.Utf8 );

			    return decrypted.toString();
			}
			resolve(decrypt(encrypted));
		});
	});
}

/*-----------------------------------------------------------------------------*/
/**
 * @Class SessionStorage
 */
function SessionStorage() {
	this.initialize.apply(this, arguments);
}

SessionStorage.prototype.initialize = function() {
}

SessionStorage.prototype.setItem = function(key, value) {
	return new Promise(function(resolve, reject) {
		Storage.encryptData(key).then(function(key){
			Storage.encryptData(value).then(function(value){
				if(key !== null && value !== null){
					if( window.sessionStorage ){
						window.sessionStorage.setItem(key, value);
						Storage.decryptData(value).then(function(value){
							resolve(value);
						});
					}
					else{
						resolve(new Error('sessionStorage 異常'));
					}
				}
				else{
					return new Error('encrypt 異常');
				}
			});
		});
	});
}

SessionStorage.prototype.getItem = function(key) {
	return new Promise(function(resolve, reject) {
		Storage.encryptData(key).then(function(key){
			if(key !== null){
				if( window.sessionStorage ){
					if(window.sessionStorage.getItem(key) === null){
						resolve(null);
					}
					else{
						var value = window.sessionStorage.getItem(key);
						Storage.decryptData(value).then(function(value){
							resolve(value);
						});
					}
				}
				else{
					reject(new Error('sessionStorage 異常'));
				}
			}
			else{
				return new Error('encrypt 異常');
			}
		});
	});
}

SessionStorage.prototype.removeItem = function(key) {
	return new Promise(function(resolve, reject) {
		Storage.encryptData(key).then(function(key){
			if(key !== null){
				if( window.sessionStorage ){
					window.sessionStorage.removeItem(key);
					if(window.sessionStorage.getItem(key) === null){
						resolve(true);
					}
					else{
						resolve(false);
					}
				}
				else{
					reject(new Error('sessionStorage 異常'));
				}
			}
			else{
				return new Error('encrypt 異常');
			}
		});
	});
}

SessionStorage.prototype.clear = function() {
	return new Promise(function(resolve, reject) {
		if( window.sessionStorage ){
			window.sessionStorage.clear();
			resolve();
		}
		else{
			reject(new Error('sessionStorage 異常'));
		}
	});
}

/*-----------------------------------------------------------------------------*/
/**
 * @Class LocalStorage
 */
function LocalStorage() {
	this.initialize.apply(this, arguments);
}

LocalStorage.prototype.initialize = function() {
}

LocalStorage.prototype.setItem = function(key, value) {
	return new Promise(function(resolve, reject) {
		Storage.encryptData(key).then(function(key){
			Storage.encryptData(value).then(function(value){
				if(key !== null && value !== null){
					if( window.localStorage ){
						window.localStorage.setItem(key, value);
						Storage.decryptData(value).then(function(value){
							resolve(value);
						});
					}
					else{
						resolve(new Error('localStorage 異常'));
					}
				}
				else{
					return new Error('encrypt 異常');
				}
			});
		});
	});
}

LocalStorage.prototype.getItem = function(key) {
	return new Promise(function(resolve, reject) {
		Storage.encryptData(key).then(function(key){
			if(key !== null){
				if( window.localStorage ){
					if(window.localStorage.getItem(key) === null){
						resolve(null);
					}
					else{
						var value = window.localStorage.getItem(key);
						Storage.decryptData(value).then(function(value){
							resolve(value);
						});
					}
				}
				else{
					reject(new Error('localStorage 異常'));
				}
			}
			else{
				return new Error('encrypt 異常');
			}
		});
	});
}

LocalStorage.prototype.removeItem = function(key) {
	return new Promise(function(resolve, reject) {
		Storage.encryptData(key).then(function(key){
			if(key !== null){
				if( window.localStorage ){
					window.localStorage.removeItem(key);
					if(window.localStorage.getItem(key) === null){
						resolve(true);
					}
					else{
						resolve(false);
					}
				}
				else{
					reject(new Error('localStorage 異常'));
				}
			}
			else{
				return new Error('encrypt 異常');
			}
		});
	});
}

LocalStorage.prototype.clear = function() {
	return new Promise(function(resolve, reject) {
		if( window.localStorage ){
			window.localStorage.clear();
			resolve();
		}
		else{
			reject(new Error('localStorage 異常'));
		}
	});
}

/*-----------------------------------------------------------------------------*/
/**
 * @Class WebStorage
 */
function WebStorage() {
	this.initialize.apply(this, arguments);
}

WebStorage.prototype.initialize = function() {
}

WebStorage.prototype.ready = function() {
	return new Promise(function(resolve, reject) {
		if(! window.localforage ){
			var scriptSrc = '/plugin/localforage/localforage.min.js';
	        var head = document.getElementsByTagName('head')[0];
	        var scriptTag = document.createElement('script');
	        scriptTag.type= 'text/javascript';
	        scriptTag.onload = scriptTag.onreadystatechange = function() {
				if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
					resolve();

					scriptTag.onload = scriptTag.onreadystatechange = null;
				}
	        };
	        scriptTag.src= scriptSrc;
	        head.appendChild(scriptTag);
		}
		else{
			resolve();
		}
	});
}

WebStorage.prototype.setDriver = function() {
	var that = this;
	return new Promise(function(resolve, reject) {
		that.ready().then(function() {
			var driverOrder = [
			    window.localforage.INDEXEDDB,
			    window.localforage.WEBSQL,
			    window.localforage.LOCALSTORAGE
			];
			window.localforage.setDriver(driverOrder).then(function() {
				resolve();
			}).catch(function(error) {
				reject(new Error('WebStorage 異常'));
			});
		});
	});
}

WebStorage.prototype.setItem = function(key, value) {
	var that = this;
	return new Promise(function(resolve, reject) {
		that.setDriver().then(function() {
			Storage.encryptData(key).then(function(key){
				Storage.encryptData(value).then(function(value){
					window.localforage.setItem(key, value).then(function(value) {
						Storage.decryptData(value).then(function(value){
							resolve(value);
						});
					}).catch(function(err) {
						reject(new Error('WebStorage 異常'));
					});
				});
			});
		});
	});
}

WebStorage.prototype.getItem = function(key) {
	var that = this;
	return new Promise(function(resolve, reject) {
		that.setDriver().then(function() {
			Storage.encryptData(key).then(function(key){
				window.localforage.getItem(key).then(function(value) {
					Storage.decryptData(value).then(function(value){
						resolve(value);
					});
				}).catch(function(err) {
					reject(new Error('WebStorage 異常'));
				});
			});
		});
	});
}

WebStorage.prototype.removeItem = function(key) {
	var that = this;
	return new Promise(function(resolve, reject) {
		that.setDriver().then(function() {
			Storage.encryptData(key).then(function(key){
				window.localforage.removeItem(key).then(function() {
					resolve();
				}).catch(function(err) {
					reject(new Error('WebStorage 異常'));
				});
			});
		});
	});
}

WebStorage.prototype.clear = function() {
	var that = this;
	return new Promise(function(resolve, reject) {
		that.setDriver().then(function() {
			window.localforage.clear().then(function() {
			    resolve();
			}).catch(function(err) {
			    reject(new Error('WebStorage 異常'));
			});
		});
	});
}

/*-----------------------------------------------------------------------------*/
/**
 * @Class Database
 */
function Database() {
	this.initialize.apply(this, arguments);
}

Database.prototype = Object.create(WebStorage.prototype);
Database.prototype.constructor = Database;

Database.prototype.initialize = function() {
	WebStorage.prototype.initialize.call(this);
}

Database.prototype.getInstance = function(table) {
	return window.localforage.createInstance({
		name: table
	});
}

Database.prototype.insert = function(table, data) {
	var that = this;
	return new Promise(function(resolve, reject) {
		that.setDriver().then(function() {
			var instance = that.getInstance(table);
			for(var key in data){
				var value = data[key];
				Storage.encryptData(key).then(function(key){
					Storage.encryptData(value).then(function(value){
						instance.setItem(key, value);
					});
				});
			}
			resolve();
		});
	});
}

Database.prototype.update = function(table, key, value) {
	var that = this;
	return new Promise(function(resolve, reject) {
		that.setDriver().then(function() {
			var instance = that.getInstance(table);
			Storage.encryptData(key).then(function(key){
				Storage.encryptData(value).then(function(value){
					instance.setItem(key, value).then(function(){
						resolve();
					}).catch(function(err) {
						reject(new Error('Database 異常'));
					});
				});
			});
		});
	});
}

Database.prototype.select = function(table) {
	var that = this;
	return new Promise(function(resolve, reject) {
		that.setDriver().then(function() {
			var instance = that.getInstance(table);
			var data = new Object();
			instance.length().then(function(length) {
				if(length > 0){
					instance.iterate(function(value, key, index) {
						Storage.decryptData(key).then(function(key){
							Storage.decryptData(value).then(function(value){
								data[key] = value;
								if(index == length){
									resolve(data);
								}
							});
						});
					}).catch(function(err) {
						reject(new Error('Database 異常'));
					});
				}
				else{
					resolve(data);
				}
			});
		});
	});
}

Database.prototype.delete = function(table) {
	var that = this;
	return new Promise(function(resolve, reject) {
		var instance = that.getInstance(table);
		instance.dropInstance().then(function() {
			resolve();
		}).catch(function(err) {
			reject(new Error('Database 異常'));
		});
	});
}

/*-----------------------------------------------------------------------------*/

Storage.createObjects = function() {
	$dataSession = new SessionStorage();
    $dataLocal = new LocalStorage();
    $dataWeb = new WebStorage();
    $dataTable = new Database();
};
Storage.createObjects();

/*-----------------------------------------------------------------------------*/
