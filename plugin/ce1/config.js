/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

ce1.editorConfig = function( config ) {
	// 允許使用者使用特定屬性
	config.allowedContent = true;
	config.extraAllowedContent='style;iframe[*];span{line-height}';

	// 增加行拒功能
	config.extraPlugins += (config.extraPlugins ?',lineheight' :'lineheight');

	// 定義字型
	config.font_names = '新細明體; 細明體; 標楷體; 微軟正黑體; Arial; Arial Black; sans-serif; Comic Sans MS; Courier New; Tahoma; Times New Roman; Verdana';

	// 定義段落
	config.format_tags = 'p;h1;h2;h3;pre;div;h4;h5'

	// 定義工具列
	config.toolbar = [
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ 'Source'] },
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
		{ name: 'links', items: [ 'Link', 'Unlink'] },
		{ name: 'insert', items: [ 'Image', 'Table', 'HorizontalRule', 'SpecialChar'] },
		'/',
		{ name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize', 'lineheight' ] },
		{ name: 'colors', items: [ 'TextColor', 'BGColor' ] },
		{ name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] },
		{ name: 'others', items: [ '-' ] },
	];

    // 為處理rwd時圖片響應問題，不讓使用者自訂圖片大小
	ce1.on('instanceReady', function (ev) {
	ev.editor.dataProcessor.htmlFilter.addRules(
	    {
	        elements:
	        {
	            $: function (element) {
	                // Output dimensions of images as width and height
	                if (element.name == 'img') {
	                    var style = element.attributes.style;

	                    if (style) {
	                        // Get the width from the style.
	                        var match = /(?:^|\s)width\s*:\s*(\d+)px/i.exec(style),
	                            width = match && match[1];

	                        // Get the height from the style.
	                        match = /(?:^|\s)height\s*:\s*(\d+)px/i.exec(style);
	                        var height = match && match[1];

	                        if (width) {
	                            element.attributes.style = element.attributes.style.replace(/(?:^|\s)width\s*:\s*(\d+)px;?/i, '');
	                            element.attributes.width = width;
	                        }

	                        if (height) {
	                            element.attributes.style = element.attributes.style.replace(/(?:^|\s)height\s*:\s*(\d+)px;?/i, '');
	                            element.attributes.height = height;
	                        }
	                    }
	                }

	                if (!element.attributes.style)
	                    delete element.attributes.style;

	                return element;
	            }
	        }
	    });
	});

	// 定義上傳功能與瀏覽資料夾檔案功能
	config.filebrowserBrowseUrl = '/plugin/ce1/ckfinder/ckfinder.html';
	config.filebrowserImageBrowseUrl = '/plugin/ce1/ckfinder/ckfinder.html?Type=Images';
	config.filebrowserUploadUrl = '/plugin/ce1/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files'; //可上傳一般檔案
	config.filebrowserImageUploadUrl = '/plugin/ce1/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images';//可上傳圖檔

};
