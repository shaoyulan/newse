/*-----------------------------------------------------------------------------*/
/**
 * 取得定位座標
 *
 * @Class GetLocation
 */
function GetLocation() {
    this.initialize.apply(this, arguments);
}

GetLocation.prototype = Object.create(Interface.prototype);
GetLocation.prototype.constructor = GetLocation;

GetLocation.prototype.initialize = function(callBack) {
    Interface.prototype.initialize.call(this, callBack);
}

GetLocation.prototype.iOS = function() {
    this._function = 'mukiGetCoordinate';
    if(typeof callBack === 'function'){
        this._callBack = callBack;
    }
    this.iBridge();
}

GetLocation.prototype.android = function() {
    this.androidBridge();
    if( window.JS ){
        window.JS.getCoordinate(this._data[0]);
    }
}

GetLocation.prototype.website = function() {
    var interface = this;
    var ishttps = 'https:' == document.location.protocol ? true: false;
    if( ishttps && window.navigator.geolocation ){
        window.navigator.geolocation.getCurrentPosition(function(p) {
            var dataList = {
                latitude : p.coords.latitude,
                longitude : p.coords.longitude
            };
            if(typeof interface._callBack === 'function'){
                interface._callBack(dataList);
            }
        });
    }
    else{
        var dataList = {
            latitude : '24.178824',
            longitude : '120.6445039'
        };
        if(typeof interface._callBack === 'function'){
            interface._callBack(dataList);
        }
    }
}

/*-----------------------------------------------------------------------------*/
/**
 * 開啟地圖導航
 *
 * @Class OpenMap
 */
function OpenMap() {
    this.initialize.apply(this, arguments);
}

OpenMap.prototype = Object.create(Interface.prototype);
OpenMap.prototype.constructor = OpenMap;

OpenMap.prototype.initialize = function() {
    Interface.prototype.initialize.call(this);
}

OpenMap.prototype.iOS = function() {
    this._function = 'mukiOpenCoordinateByMap';
    this.iBridge();
}

OpenMap.prototype.android = function() {
    if( window.JS ){
        window.JS.openCoordinateByMap(this._data[0], this._data[1]);
    }
}

OpenMap.prototype.website = function() {
    var interface = this;
    if(typeof this._data[0] !== 'undefined' && typeof this._data[1] !== 'undefined'){
        var ishttps = 'https:' == document.location.protocol ? true: false;
        if( ishttps && window.navigator.geolocation ){
            window.navigator.geolocation.getCurrentPosition(function(p) {
                window.open('https://www.google.com.tw/maps?saddr=' + p.coords.latitude + ',' + p.coords.longitude + '&daddr=' + interface._data[0] + ',' + interface._data[1]);
            });
        }
        else{
            window.open('https://www.google.com.tw/maps?daddr=' + this._data[0] + ',' + this._data[1]);
        }
    }
}

/*-----------------------------------------------------------------------------*/
/**
 * 監控GPS定位
 *
 * @Class DetectionGPS
 */
function DetectionGPS() {
    this.initialize.apply(this, arguments);
}

DetectionGPS.prototype = Object.create(Interface.prototype);
DetectionGPS.prototype.constructor = DetectionGPS;

DetectionGPS.prototype.initialize = function(callBack) {
    Interface.prototype.initialize.call(this, callBack);
}

DetectionGPS.prototype.iOS = function() {
    this._function = 'mukiDetectionGPS';
    this.iBridge();
}

DetectionGPS.prototype.android = function() {
    this.androidBridge();
    if( window.JS ){
        window.JS.detectionGPS(this._data[0]);
    }
}

/*-----------------------------------------------------------------------------*/