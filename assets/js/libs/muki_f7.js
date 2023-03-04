/**
 * 管理Framework7控件的靜態類
 */
function F7() {
	throw new Error('This is a static class');
}

var $f7Picker = null;

/*-----------------------------------------------------------------------------*/
/**
 * @Class Picker
 */
function Picker() {
	this.initialize.apply(this, arguments);
}

Picker.prototype.initialize = function() {
	this._define = '';
}

Picker.prototype.getArray = function(object) {
	var list = new Array();
	if(typeof object !== 'Array'){
		for(var key in object){
			var info = {
				'id': key,
				'topic': object[key]
			};
			list.push(info);
		}
	}
	return list;
}

Picker.prototype.create = function(element, data, define) {
	if(typeof define === 'undefined'){
		define = '';
	}
    document.querySelector(element).setAttribute('data-select_value', define);
    document.querySelector(element).setAttribute('data-list', JSON.stringify(data));
	app.picker.create({
        inputEl: element,
        value: [
            define
        ],
        formatValue: function (values, displayValues) {
            return displayValues[0];
        },
        cols: [
            {
              textAlign: 'center',
              values: (function () {
                var list = new Array();
                for(var key in data){
                    list.push(data[key]['id']);
                }
                return list;
              })(),
              displayValues:  (function () {
                var list = new Array();
                for(var key in data){
                    list.push(data[key]['topic']);
                }
                return list;
              })(),
            }
        ],
        on: {
            closed: function (picker) {
                var col = picker.cols[0];
                document.querySelector(element).setAttribute('data-select_value', col.value);
            }
        }
    });
}

/*-----------------------------------------------------------------------------*/

F7.createObjects = function() {
	$f7Picker = new Picker();
};
F7.createObjects();

/*-----------------------------------------------------------------------------*/