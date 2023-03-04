/**
 * 介接 Firebase 功能的基本類別
 *
 * @Class Firebase
 */
function Firebase() {
	this.initialize.apply(this, arguments);
}

Firebase.prototype.initialize = function() {
	this._firebaseConfig = {
		apiKey: "AIzaSyAQHgrlVwiCJV-w5CWPvsuohqmYbG6wBTM",
		authDomain: "mukiimb.firebaseapp.com",
		databaseURL: "https://mukiimb.firebaseio.com",
		projectId: "mukiimb",
		storageBucket: "mukiimb.appspot.com",
		messagingSenderId: "814997111075",
		appId: "1:814997111075:web:ce5e1f1f08b27dfd044c96",
		measurementId: "G-MD44B6NMCV"
	};
	this._firebase_link = 'https://www.gstatic.com/firebasejs/7.8.0/';
	this._firebase_id = 0;
}

Firebase.prototype.ready = function() {
	var that = this;
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
	return new Promise(function(resolve, reject) {
		if(! window.firebase ){
	    	setScript(that._firebase_link + 'firebase-app.js', function(){
	    		setScript(that._firebase_link + 'firebase-analytics.js', function(){
	    			setScript(that._firebase_link + 'firebase-auth.js', function(){
	    				setScript(that._firebase_link + 'firebase-database.js', function(){
	    					if (! window.firebase.apps.length) {
								window.firebase.initializeApp(that._firebaseConfig);
							}
							window.firebase.analytics();
							that._db = window.firebase.database();
							resolve();
						});
					});
	    		});
	    	});
	    }
	    else{
	    	resolve();
	    }
	});
}

Firebase.prototype.setId = function(id){
	this._firebase_id = id;
}

Firebase.prototype.getId = function(){
	return this._firebase_id;
}

Firebase.prototype.setItem = function(route, id, data){
	var that = this;
	that.ready().then(function(){
		that.setId(id);
        that._db.ref(route + '/' + that._firebase_id).set(data);
	});
}