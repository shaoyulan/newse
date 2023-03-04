/**
 * Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ce1.com/license
 */

// Tool scripts for the sample pages.
// This file can be ignored and is not required to make use of CKEditor.

( function() {
	ce1.on( 'instanceReady', function( ev ) {
		// Check for sample compliance.
		var editor = ev.editor,
			meta = ce1.document.$.getElementsByName( 'ce1-sample-required-plugins' ),
			requires = meta.length ? ce1.dom.element.get( meta[ 0 ] ).getAttribute( 'content' ).split( ',' ) : [],
			missing = [],
			i;

		if ( requires.length ) {
			for ( i = 0; i < requires.length; i++ ) {
				if ( !editor.plugins[ requires[ i ] ] )
					missing.push( '<code>' + requires[ i ] + '</code>' );
			}

			if ( missing.length ) {
				var warn = ce1.dom.element.createFromHtml(
					'<div class="warning">' +
						'<span>To fully experience this demo, the ' + missing.join( ', ' ) + ' plugin' + ( missing.length > 1 ? 's are' : ' is' ) + ' required.</span>' +
					'</div>'
				);
				warn.insertBefore( editor.container );
			}
		}

		// Set icons.
		var doc = new ce1.dom.document( document ),
			icons = doc.find( '.button_icon' );

		for ( i = 0; i < icons.count(); i++ ) {
			var icon = icons.getItem( i ),
				name = icon.getAttribute( 'data-icon' ),
				style = ce1.skin.getIconStyle( name, ( ce1.lang.dir == 'rtl' ) );

			icon.addClass( 'cke_button_icon' );
			icon.addClass( 'cke_button__' + name + '_icon' );
			icon.setAttribute( 'style', style );
			icon.setStyle( 'float', 'none' );

		}
	} );
} )();
