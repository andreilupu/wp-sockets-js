/**
 * WordPress dependencies.
 */
import { createElement } from '@wordpress/element';
import { addAction, addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies.
 */

/**
 * Registers a socket type.
 *
 * @param {string}   appId     The app id.
 * @param {string}   type      The socket type.
 * @param {Function} component The component to render.
 */
const registerSocketType = ( appId, type, component ) => {
	const uppercased = type.charAt( 0 ).toUpperCase() + type.slice( 1 );

	addFilter(
		`${ appId }Sockets.socketType${ uppercased }`,
		`${ appId }Sockets`,
		( _currentComponent, socket ) => {
			if ( ! component ) {
				return null;
			}
			return createElement( component, { options: socket } );
		}
	);
};

/**
 * Desc: @TODO Document this function.
 */
const registerSocketsActions = () => {
	// Lazy load components to avoid circular dependencies
	const TextSocketModule = require( './components/sockets/text' );
	const TextareaSocketModule = require( './components/sockets/textarea' );
	const GroupModule = require( './components/sockets/group' );

	const { TextSocket } = TextSocketModule;
	const { TextareaSocket } = TextareaSocketModule;
	const { Group } = GroupModule;

	// Register the socket types via filters.
	addAction( 'sockets.loadTypes', 'sockets', ( appId ) => {
		registerSocketType( appId, 'text', TextSocket );
		registerSocketType( appId, 'textarea', TextareaSocket );
		registerSocketType( appId, 'group', Group );
	} );
};

export { registerSocketsActions };
