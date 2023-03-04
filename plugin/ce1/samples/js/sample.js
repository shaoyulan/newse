/**
 * Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ce1.com/license
 */

/* exported initSample */

if ( ce1.env.ie && ce1.env.version < 9 )
	ce1.tools.enableHtml5Elements( document );

// The trick to keep the editor in the sample quite small
// unless user specified own height.
ce1.config.height = 150;
ce1.config.width = 'auto';

var initSample = ( function() {
	var wysiwygareaAvailable = isWysiwygareaAvailable(),
		isBBCodeBuiltIn = !!ce1.plugins.get( 'bbcode' );

	return function() {
		var editorElement = ce1.document.getById( 'editor' );

		// :(((
		if ( isBBCodeBuiltIn ) {
			editorElement.setHtml(
				'Hello world!\n\n' +
				'I\'m an instance of [url=http://ce1.com]CKEditor[/url].'
			);
		}

		// Depending on the wysiwygare plugin availability initialize classic or inline editor.
		if ( wysiwygareaAvailable ) {
			ce1.replace( 'editor' );
		} else {
			editorElement.setAttribute( 'contenteditable', 'true' );
			ce1.inline( 'editor' );

			// TODO we can consider displaying some info box that
			// without wysiwygarea the classic editor may not work.
		}
	};

	function isWysiwygareaAvailable() {
		// If in development mode, then the wysiwygarea must be available.
		// Split REV into two strings so builder does not replace it :D.
		if ( ce1.revision == ( '%RE' + 'V%' ) ) {
			return true;
		}

		return !!ce1.plugins.get( 'wysiwygarea' );
	}
} )();

