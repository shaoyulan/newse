/**
 * @Class GoogleMap
 */
function GoogleMap() {
	this.initialize.apply(this, arguments);
}

GoogleMap.prototype.initialize = function() {
	this._config = {
		element : 'map',
		height : document.documentElement.clientHeight,
		zoom : 18,
		maxZoom : 20,
		minZoom : 10
	}

	this._styles = [
		{
			featureType : 'poi',
			stylers : [{visibility : 'off'}]
		}
    ];

	this._centerMarker = null;
	this._infoWindow = null;

	this._markers = new Array();
	this._markerClusterer = new Array();
	this._lines = new Array();
	this._circles = new Array();
	this._squares = new Array();

	this._iconPath = '/assets/images-m/map/';
	this._iconStyle = {
		width : 50,
		height : 50,
		color : '#FFF'
	}

	this._center = {
		lat : 24.1619656,
		lng : 120.65157
	}

	this._center['icon'] = {
		url : this._iconPath + 'map-tip.svg',
		scaledSize : new google.maps.Size(40, 40)
	}
}

GoogleMap.prototype.resetConfig = function(config) {
	this._config = config;
}

GoogleMap.prototype.updateConfig = function(config) {
	for(var key in config){
		if(typeof this._config[key] !== 'undefined'){
			this._config[key] = config[key];
		}
	}
}

GoogleMap.prototype.resetStyles = function(styles) {
	this._styles = styles;
}

GoogleMap.prototype.clear = function() {
	if(typeof document.getElementById(this._config['element']) !== 'undefined'){
		document.getElementById(this._config['element']).innerHTML = '';
		if(typeof this._config['height'] !== 'undefined'){
			document.getElementById(this._config['element']).style.height = this._config['height'] + 'px';
		}
		else{
			document.getElementById(this._config['element']).style.height = document.documentElement.clientHeight + 'px';
		}
	}
}

GoogleMap.prototype.create = function() {
	var that = this;

	that.clear();

	//地圖主體
	that._main = new google.maps.Map(document.getElementById(that._config['element']), {
		zoom : that._config['zoom'],
		maxZoom : (typeof that._config['maxZoom'] !== 'undefined'?that._config['maxZoom']:20),
		minZoom : (typeof that._config['minZoom'] !== 'undefined'?that._config['minZoom']:10),
		disableDefaultUI : true,
		styles : that._styles
    });
    that.setCenter();

    //地圖縮放
    google.maps.event.addListener(that._main, 'zoom_changed', function() {
    	that._ne = that._main.getBounds().getNorthEast();
        that._sw = that._main.getBounds().getSouthWest();
        that._zoom = that._main.getZoom();
        that.zoomMap();
    });
    //地圖拖放停止
    google.maps.event.addListener(that._main, 'dragend', function() {
    	that._ne = that._main.getBounds().getNorthEast();
        that._sw = that._main.getBounds().getSouthWest();
        that._zoom = that._main.getZoom();
        that.dragEndMap();
    });
    //取得區域資訊
    google.maps.event.addListener(that._main, 'bounds_changed', function() {
    	that._ne = that._main.getBounds().getNorthEast();
        that._sw = that._main.getBounds().getSouthWest();
        that._zoom = that._main.getZoom();
        that.changedMap();
    });

    //資訊視窗
    that._infoWindow = new google.maps.InfoWindow;
    google.maps.event.addListener(that._infoWindow, 'domready', function() {
    	that.openInfoWindow(this);
    });
    google.maps.event.addListener(that._infoWindow, 'closeclick', function() {
    	that.closeInfoWindow(this);
    });
}

GoogleMap.prototype.windowCenter = function() {
	var that = this;
	var bounds = {
		southwest: {
			lat: parseFloat(that._sw.lat()),
			lng: parseFloat(that._sw.lng())
		},
		northeast: {
			lat: parseFloat(that._ne.lat()),
			lng: parseFloat(that._ne.lng()),
		}
	};
	if ((bounds.southwest.lng - bounds.northeast.lng > 180) || (bounds.northeast.lng - bounds.southwest.lng > 180)) {
		bounds.southwest.lng += 360;
		bounds.southwest.lng %= 360;
		bounds.northeast.lng += 360;
		bounds.northeast.lng %= 360;
	}
	var center = {
		lat : (bounds.southwest.lat + bounds.northeast.lat) * 0.5,
		lng : (bounds.southwest.lng + bounds.northeast.lng) * 0.5
	};
	return center;
}

GoogleMap.prototype.getZoom = function() {
	return this._main.getZoom();
}

GoogleMap.prototype.setZoom = function(zoom) {
	var that = this;

	that._main.setZoom(zoom);
}

GoogleMap.prototype.zoomMap = function() {

}

GoogleMap.prototype.dragEndMap = function() {

}

GoogleMap.prototype.changedMap = function() {

}

GoogleMap.prototype.setCenter = function(coordinate, is_show_center) {
	var that = this;
	if(typeof coordinate !== 'undefined'){
		for(var key in coordinate){
			that._center[key] = parseFloat(coordinate[key]);
		}
	}
	if(typeof is_show_center === 'undefined'){
		is_show_center = 0;
	}

	that._main.setCenter(new google.maps.LatLng(that._center['lat'], that._center['lng']));

	//中心點
	if(is_show_center == 1){
		that._centerMarker = new google.maps.Marker({
			map : that._main,
			position : new google.maps.LatLng(that._center['lat'], that._center['lng']),
			icon: that._center['icon'] || {}
		});
	}
}

GoogleMap.prototype.setInfoWindow = function(obj) {
	var that = this;
	var marker_info = obj['info'];

	var html = '<div>' + marker_info['title'] + '</div>';

	that._infoWindow.setContent('<div class="info_window">' + html + '</div>');
    that._infoWindow.open(that._main, obj);
}

GoogleMap.prototype.openInfoWindow = function(obj) {

}

GoogleMap.prototype.closeInfoWindow = function(obj) {

}

GoogleMap.prototype.addMarker = function(marker_info, z_index) {
	var that = this;
	var icon_width = marker_info['width'] || that._iconStyle['width'];
	var icon_height = marker_info['height'] || that._iconStyle['height'];
	if(typeof z_index === 'undefined'){
		z_index = 1;
	}

	var marker_index = that._markers.length;

	if(typeof marker_info['value'] !== 'undefined'){
		var marker = new google.maps.Marker({
			map : that._main,
			position : new google.maps.LatLng(parseFloat(marker_info['lat']), parseFloat(marker_info['lng'])),
			icon : {
				url : marker_info['icon'] || '',
				scaledSize : new google.maps.Size(icon_width, icon_height)
			},
			zIndex : z_index,
			title : marker_info['title'] || '',
			label : {
				text : label,
				color : that._iconStyle['color']
			},
			info : marker_info
		});
	}
	else{
		var marker = new google.maps.Marker({
			map : that._main,
			position : new google.maps.LatLng(parseFloat(marker_info['lat']), parseFloat(marker_info['lng'])),
			icon : {
				url : marker_info['icon'] || '',
				scaledSize : new google.maps.Size(icon_width, icon_height)
			},
			zIndex : z_index,
			title : marker_info['title'] || '',
			info : marker_info
		});
	}
	that._markers.push(marker);

	google.maps.event.addListener(that._markers[marker_index], 'click', function() {
		that.clickMarker(this);
    });
}

GoogleMap.prototype.clickMarker = function(marker) {
	this.setInfoWindow(marker);
}

GoogleMap.prototype.showMarker = function(key) {
	this._markers[key].setMap(this._main);
}

GoogleMap.prototype.hideMarker = function(key) {
	this._markers[key].setMap(null);
}

GoogleMap.prototype.clearMarker = function() {
	this._markers = new Array();
}

GoogleMap.prototype.allMarker = function(is_hide, is_clear) {
	if(typeof is_clear === 'undefined'){
		is_clear = 0;
	}

	for(var key in this._markers){
		if(is_hide == 0){
			this.showMarker(key);
		}
		else{
			this.hideMarker(key);
		}
	}

	if(is_clear == 1){
		this.clearMarker();
	}
}

GoogleMap.prototype.addLine = function(line_info) {
	var that = this;

	var line = new google.maps.Polyline({
		map : that._main,
		path : [
	        {lat: parseFloat(line_info['lat1']), lng: parseFloat(line_info['lng1'])},
	        {lat: parseFloat(line_info['lat2']), lng: parseFloat(line_info['lng2'])},
	    ],
		geodesic : true,
        strokeColor : line_info['color'] || '',
        strokeOpacity : 1.0,
        strokeWeight : 3,
		title : line_info['title'] || '',
		info : line_info
	});
	that._lines.push(line);

	google.maps.event.addListener(that._lines[(parseInt(that._lines.length) - 1)], 'click', function() {
		that.clickLine(this);
    });
}

GoogleMap.prototype.clickLine = function(line) {

}

GoogleMap.prototype.showLine = function(key) {
	this._lines[key].setMap(this._main);
}

GoogleMap.prototype.hideLine = function(key) {
	this._lines[key].setMap(null);
}

GoogleMap.prototype.clearLine = function() {
	this._lines = new Array();
}

GoogleMap.prototype.allLine = function(is_hide, is_clear) {
	if(typeof is_clear === 'undefined'){
		is_clear = 0;
	}

	for(var key in this._lines){
		if(is_hide == 0){
			this.showLine(key);
		}
		else{
			this.hideLine(key);
		}
	}

	if(is_clear == 1){
		this.clearLine();
	}
}

GoogleMap.prototype.addCircle = function(circle_info) {
	var that = this;

	var circle = new google.maps.Circle({
		map : that._main,
		center : {lat: parseFloat(circle_info['lat']), lng: parseFloat(circle_info['lng'])},
		radius : circle_info['radius'],
        strokeOpacity : 0,
        fillColor : circle_info['color'],
        fillOpacity : 0.25,
		title : circle_info['title'] || '',
		info : circle_info
	});
	that._circles.push(circle);

	google.maps.event.addListener(that._circles[(parseInt(that._circles.length) - 1)], 'click', function() {
		that.clickCircle(this);
    });
}

GoogleMap.prototype.clickCircle = function(circle) {

}

GoogleMap.prototype.showCircle = function(key) {
	this._circles[key].setMap(this._main);
}

GoogleMap.prototype.hideCircle = function(key) {
	this._circles[key].setMap(null);
}

GoogleMap.prototype.clearCircle = function() {
	this._circles = new Array();
}

GoogleMap.prototype.allCircle = function(is_hide, is_clear) {
	if(typeof is_clear === 'undefined'){
		is_clear = 0;
	}

	for(var key in this._circles){
		if(is_hide == 0){
			this.showCircle(key);
		}
		else{
			this.hideCircle(key);
		}
	}

	if(is_clear == 1){
		this.clearCircle();
	}
}

GoogleMap.prototype.addSquare = function(square_info) {
	var that = this;

	var square = new google.maps.Rectangle({
		map : that._main,
		bounds : {
			north : parseFloat(square_info['north']),
			east : parseFloat(square_info['east']),
			south : parseFloat(square_info['south']),
			west : parseFloat(square_info['west'])
	    },
		strokeOpacity : 0,
        fillColor : square_info['color'],
        fillOpacity : 0.25,
        editable : true,
		title : square_info['title'] || '',
		info : square_info
	});
	that._squares.push(square);

	google.maps.event.addListener(that._squares[(parseInt(that._squares.length) - 1)], 'click', function() {
		that.clickSquare(this);
    });
}

GoogleMap.prototype.clickSquare = function(square) {

}

GoogleMap.prototype.showSquare = function(key) {
	this._squares[key].setMap(this._main);
}

GoogleMap.prototype.hideSquare = function(key) {
	this._squares[key].setMap(null);
}

GoogleMap.prototype.clearSquare = function() {
	this._squares = new Array();
}

GoogleMap.prototype.allSquare = function(is_hide, is_clear) {
	if(typeof is_clear === 'undefined'){
		is_clear = 0;
	}

	for(var key in this._squares){
		if(is_hide == 0){
			this.showSquare(key);
		}
		else{
			this.hideSquare(key);
		}
	}

	if(is_clear == 1){
		this.clearSquare();
	}
}

/*-----------------------------------------------------------------------------*/