﻿/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ce1.com/license
*/

(function()
{
//debugger
	function addCombo( editor, comboName, styleType, lang, entries, defaultLabel, styleDefinition )
	{
		var config = editor.config;

		// Gets the list of fonts from the settings.
		var names = entries.split( ';' ),
			values = [];

		// Create style objects for all fonts.
		var styles = {};
		for ( var i = 0 ; i < names.length ; i++ )
		{
			var parts = names[ i ];

			if ( parts )
			{
				parts = parts.split( '/' );

				var vars = {},
					name = names[ i ] = parts[ 0 ];

				vars[ styleType ] = values[ i ] = parts[ 1 ] || name;

				styles[ name ] = new ce1.style( styleDefinition, vars );
				styles[ name ]._.definition.name = name;
			}
			else
				names.splice( i--, 1 );
		}

		editor.ui.addRichCombo( comboName,
			{
			    label: lang.lineheight.label,
				title: lang.lineheight.panelTitle,
				className: 'cke_' + (styleType == 'size' ? 'fontSize' : 'font'),
				panel :
				{
                    css:[ce1.skin.getPath("editor")].concat( config.contentsCss),
					multiSelect : false,
					attributes: { 'aria-label': lang.lineheight.panelTitle }
				},

				init : function()
				{
				    this.startGroup(lang.lineheight.panelTitle);

					for ( var i = 0 ; i < names.length ; i++ )
					{
						var name = names[ i ];

						// Add the tag entry to the panel list.
						this.add( name, styles[ name ].buildPreview(), name );
					}
				},

				onClick : function( value )
				{
					editor.focus();
					editor.fire( 'saveSnapshot' );

					var style = styles[ value ];

					if ( this.getValue() == value )
						style.remove( editor.document );
					else
						style.apply( editor.document );

					editor.fire( 'saveSnapshot' );
				},

				onRender : function()
				{
					editor.on( 'selectionChange', function( ev )
						{
							var currentValue = this.getValue();

							var elementPath = ev.data.path,
								elements = elementPath.elements;

							// For each element into the elements path.
							for ( var i = 0, element ; i < elements.length ; i++ )
							{
								element = elements[i];

								// Check if the element is removable by any of
								// the styles.
								for ( var value in styles )
								{
									if ( styles[ value ].checkElementRemovable( element, true ) )
									{
										if ( value != currentValue )
											this.setValue( value );
										return;
									}
								}
							}

							// If no styles match, just empty it.
							this.setValue( '', defaultLabel );
						},
						this);
				}
			});
	}

	ce1.plugins.add('lineheight',
	{
	    lang: ['zh-tw'],
	    requires: ['richcombo'],

		init : function( editor )
		{
			var config = editor.config;
			addCombo(editor, 'lineheight', 'size', editor.lang, config.lineheight_sizes, config.fontSize_defaultLabel, config.lineheight_style);
		}
	});
})();


/**
 * The text to be displayed in the Font combo is none of the available values
 * matches the current cursor position or text selection.
 * @type String
 * @example
 * // If the default site font is Arial, we may making it more explicit to the end user.
 * config.font_defaultLabel = 'Arial';
 */
ce1.config.font_defaultLabel = '';


ce1.config.lineheight_sizes =
	'normal;1.5em;1.75em;2em;3em;4em;5em;100%;120%;130%;150%;170%;180%;190%;200%;220%;250%;300%;400%;500%';

ce1.config.lineheight_style =
	{
		element		: 'span',
		styles		: { 'line-height' : '#(size)' },
		overrides: [{ element: 'line', attributes: { 'height': null}}]
	};
