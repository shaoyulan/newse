/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ce1.com/license
 */

ce1.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	config.allowedContent = true;
	config.extraAllowedContent='style line-height';
	config.extraPlugins += (config.extraPlugins ?',lineheight' :'lineheight');

	config.font_names ='Arial/Arial, Helvetica, sans-serif;Comic Sans MS/Comic Sans MS, cursive;Courier New/Courier New, Courier, monospace;Georgia/Georgia, serif;Lucida Sans Unicode/Lucida Sans Unicode, Lucida Grande, sans-serif;Tahoma/Tahoma, Geneva, sans-serif;Times New Roman/Times New Roman, Times, serif;Trebuchet MS/Trebuchet MS, Helvetica, sans-serif;Verdana/Verdana, Geneva, sans-serif;新細明體;標楷體;微軟正黑體' ; // 為加入額外字體

	config.filebrowserBrowseUrl = '/plugin/ce1/ckfinder/ckfinder.html';
	config.filebrowserImageBrowseUrl = '/plugin/ce1/ckfinder/ckfinder.html?Type=Images';
	config.filebrowserFlashBrowseUrl = '/plugin/ce1/ckfinder/ckfinder.html?Type=Flash';
	config.filebrowserUploadUrl = '/plugin/ce1/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files'; //可上傳一般檔案
	config.filebrowserImageUploadUrl = '/plugin/ce1/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images';//可上傳圖檔
	config.filebrowserFlashUploadUrl = '/plugin/ce1/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Flash';//可上傳Flash檔案
};
