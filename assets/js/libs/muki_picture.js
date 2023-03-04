/*-----------------------------------------------------------------------------*/
/**
 * 處理圖片
 *
 * @Class Picture
 */
function Picture() {
	this.initialize.apply(this, arguments);
}

Picture.prototype = Object.create(Interface.prototype);
Picture.prototype.constructor = Picture;

Picture.prototype.initialize = function(callBack) {
	Interface.prototype.initialize.call(this, callBack);

	if(! window.Croppie){
		var scriptSrc = '/plugin/croppie/croppie.min.js';
        var head = document.getElementsByTagName('head')[0];
        var scriptTag = document.createElement('script');
        scriptTag.type= 'text/javascript';
        scriptTag.onload = scriptTag.onreadystatechange = function() {
			if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {

				var linkSrc = '/plugin/croppie/croppie.css';
				var linkTag = document.createElement('link');
				linkTag.href = linkSrc;
				linkTag.setAttribute('rel','stylesheet');
				linkTag.setAttribute('media','all');
				linkTag.setAttribute('type','text/css');
				head.appendChild(linkTag);

				scriptTag.onload = scriptTag.onreadystatechange = null;
			}
        };
        scriptTag.src = scriptSrc;
        head.appendChild(scriptTag);
	}
}

Picture.prototype.iOS = function() {
	this.website();
}

Picture.prototype.android = function() {
	if(typeof this._data[0] === 'undefined'){
		this._data[0] = 1;
	}
	if(typeof this._data[1] === 'undefined'){
		this._data[1] = 0;
	}
	if(typeof this._data[2] === 'undefined'){
		this._data[2] = 0;
	}
	if(typeof this._data[3] === 'undefined'){
		this._data[3] = 0;
	}
	this.androidBridge();
	this._data[5] = 'base64'; /*blob*/

	if( window.JS ){
		window.JS.callSelectPic(this._data[0], this._data[1], this._data[2], this._data[3], this._data[4], this._data[5]);
	}
}

/*取得相位角*/
Picture.prototype.getOrientation = function(file, callBack) {
	var get = function() {
		var binaryData = new Array();
		binaryData.push(file);
		var blob = window.URL.createObjectURL(new Blob(binaryData, {type: 'application/zip'}));

		if( window.EXIF ){
			EXIF.getData(file, function() {
		        EXIF.getAllTags(this);
		        var Orientation = EXIF.getTag(this, 'Orientation');
		        callBack(blob, Orientation);
		    });
		}
		else{
			callBack(blob, null);
		}
	}

	if(! window.EXIF ){
		var scriptSrc = '/plugin/croppie/exif.js';
        var head = document.getElementsByTagName('head')[0];
        var scriptTag = document.createElement('script');
        scriptTag.type= 'text/javascript';
        scriptTag.onload = scriptTag.onreadystatechange = function() {
			if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
				get();
				scriptTag.onload = scriptTag.onreadystatechange = null;
			}
        };
        scriptTag.src = scriptSrc;
        head.appendChild(scriptTag);
	}
	else{
		get();
	}
}

/*旋轉並壓縮*/
Picture.prototype.compress = function(origin, callBack, orientation, maxLimit) {
	if(typeof maxLimit === 'undefined'){
		maxLimit = 900;
	}
	var image = new Image();
    image.src = origin;
    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth;
        canvas.height = this.naturalHeight;
        var ratio = canvas.width / canvas.height;
        /*若是正方形 or 寬圖片*/
        if(canvas.width >= canvas.height){
        	if(canvas.width >= maxLimit){
	            canvas.width = maxLimit;
	            canvas.height = canvas.width / ratio;
	        }
        }
        /*若是長圖片*/
        else{
        	ratio = canvas.height / canvas.width;
        	if(canvas.height > maxLimit){
	            canvas.height = maxLimit;
	            canvas.width = canvas.height / ratio;
	        }
        }
        var ctx = canvas.getContext('2d');
        ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
        if (orientation !== null) {
            var width = canvas.width;
            var height = canvas.height;
            switch (orientation) {
            	/*需要順時針90度旋轉*/
                case 6:
                    canvas.width = height;
                    canvas.height = width;
                    ctx.rotate(90 * Math.PI / 180);
                    ctx.drawImage(this, 0, -height, canvas.height, canvas.width);
                    break;
                /*需要逆時針90度旋轉*/
                case 8:
                    canvas.width = height;
                    canvas.height = width;
                    ctx.rotate(-90 * Math.PI / 180);
                    ctx.drawImage(this, -width, 0, canvas.height, canvas.width);
                    break;
                /*需要180度旋轉*/
                case 3:
                    ctx.rotate(180 * Math.PI / 180);
                    ctx.drawImage(this, -width, -height, canvas.width, canvas.height);
                    break;
            }
        }
        var res_data = canvas.toDataURL('image/png', 0.8);
        callBack(res_data);
    };
}

/*處理裁切預覽*/
Picture.prototype.handle = function(file, elementName) {
	var that = this;
	that.loadingStart();
	return new Promise(function(resolve, reject) {
		that.getOrientation(file, function(blob, orientation) {
			that.compress(blob, function(data) {
				if(typeof that._vanilla !== 'undefined'){
					that._vanilla.destroy();
				}
				if(that._data[0] == 2 && typeof elementName !== 'undefined'){
					if( window.Croppie && document.querySelector(elementName) !== null){
						/*計算預覽高度*/
						var preview = that._data[2] * document.querySelector(elementName).offsetWidth / that._data[1];
						document.querySelector(elementName).style.height = preview + 'px';
						/*建立預覽畫面*/
						that._vanilla = new Croppie(document.querySelector(elementName), {
							url: data,
						    showZoomer: false,
						    viewport: {
						        width: document.querySelector(elementName).offsetWidth,
						        height: document.querySelector(elementName).offsetHeight
						    }
						});
					}
				}
				that.loadingStop();
				if(typeof that._vanilla === 'undefined'){
					that._callBack(data);
				}
				resolve(data);
	        }, orientation);
		});
	});
}

Picture.prototype.loadingStart = function() {
}

Picture.prototype.loadingStop = function() {
}

/*取得裁切結果*/
Picture.prototype.result = function() {
	var that = this;
	if(typeof that._vanilla !== 'undefined'){
		that._vanilla.result({
	  		type: 'base64',
	  		size: {
	  			width: that._data[1],
				height: that._data[2],
	  		},
	  		format: 'png',
	  		quality: 1,
	  		circle: false
	  	}).then(function(data) {
	  		that._callBack(data);
		});
	}
}

/*base64解碼 Base64.URL_SAFE, Base64.NO_WRAP, Base64.NO_PADDING*/
Picture.prototype.decode = function(input) {
    // Replace non-url compatible chars with base64 standard chars
    input = input
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    // Pad out with standard base64 required padding characters
    var pad = input.length % 4;
    if(pad) {
      if(pad === 1) {
        throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
      }
      input += new Array(5-pad).join('=');
    }

    return input;
}

/*url 轉 base64*/
Picture.prototype.urlToBase64 = function(url) {
	return new Promise(function(resolve, reject) {
		var img = new Image();
		img.onload = function() {
			var canvas = document.createElement('canvas');
			canvas.width = this.naturalWidth;
			canvas.height = this.naturalHeight;
			canvas.getContext('2d').drawImage(img, 0, 0);
			var result = canvas.toDataURL('image/png');
			resolve(result);
		};
		img.src = url;
		img.onerror = function() {
			reject(new Error('圖片流異常'));
		};
	});
}

/*base64 轉 blob*/
Picture.prototype.base64ToBlob = function(dataURI) {
	return new Promise(function(resolve, reject) {
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var byteString = atob(dataURI.split(',')[1]);
        var arrayBuffer = new ArrayBuffer(byteString.length);
        var intArray = new Uint8Array(arrayBuffer);
        for (var i = 0; i < byteString.length; i++) {
            intArray[i] = byteString.charCodeAt(i);
        }
        resolve(new Blob([intArray], {type: mimeString}));
	});
}

/*blob 轉 base64*/
Picture.prototype.blobToBase64 = function(blob) {
	return new Promise(function(resolve, reject) {
		var fr = new FileReader();
		fr.onload = function(event) {
	        resolve(event.target.result);
	    };
	    fr.readAsDataURL(blob);
	    fr.onerror = function() {
	    	reject(new Error('文件流異常'));
	    };
	});
}

/*上傳 blob*/
Picture.prototype.upload = function(blob) {
	return new Promise(function(resolve, reject) {
		var fd = new FormData();
		fd.append('file', blob, 'file.png');
		var xhr = new XMLHttpRequest();
		xhr.open('POST', window.location.protocol + '//' + window.location.host + '/ajax/ajax_common/upload_picture', true);
		xhr.onload = function(evt) {
			var request = evt.target;
			if(request.status === 200) {
				resolve(request.response);
			}
			else{
				reject(new Error('伺服器異常'));
			}
		}
		xhr.send(fd);
	});
}

/*-----------------------------------------------------------------------------*/
/**
 * 解析 QR Code
 *
 * @Class ReQrcode
 */
function ReQrcode() {
	this.initialize.apply(this, arguments);
}

ReQrcode.prototype = Object.create(Picture.prototype);
ReQrcode.prototype.constructor = ReQrcode;

ReQrcode.prototype.initialize = function(callBack) {
	Picture.prototype.initialize.call(this, callBack);

	if(! window.qrcode){
		var scriptSrc = '/plugin/croppie/reqrcode.js';
        var head = document.getElementsByTagName('head')[0];
        var scriptTag = document.createElement('script');
        scriptTag.type= 'text/javascript';
        scriptTag.onload = scriptTag.onreadystatechange = function() {
			if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
				scriptTag.onload = scriptTag.onreadystatechange = null;
			}
        };
        scriptTag.src = scriptSrc;
        head.appendChild(scriptTag);
	}
}

/*-----------------------------------------------------------------------------*/