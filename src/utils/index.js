/**
 * WordPress dependencies.
 */
import { createRoot } from '@wordpress/element';
/**
 * Internal dependencies.
 */
import { SocketsWpApp } from './../components';

const createSocketsWpRoot = ( id, config ) => {
	const { selector, mode = 'panel', sockets } = config;

	if ( typeof id !== 'string' || id.length === 0 ) {
		return;
	}

	// use the selector if exists, otherwise try the #appId as fallback.
	let element = document.querySelector( selector );

	if ( element === null ) {
		element = document.querySelector( '#' + id );
	}

	// if the element exists, render the app
	if ( element ) {
		const root = createRoot( element );
		root.render(
			<SocketsWpApp id={ id } options={ { mode } } sockets={ sockets } />
		);
	}
};

export { createSocketsWpRoot };
