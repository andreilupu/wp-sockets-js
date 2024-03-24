/**
 * WordPress dependencies.
 */
import { createElement } from '@wordpress/element';
import { addAction, addFilter, applyFilters } from '@wordpress/hooks';
/**
 * Internal dependencies.
 */
import { SOCKET_TYPES } from './enums';

/**
 * Desc: @TODO Document this function.
 */
const registerSocketsActions = () => {
	// Register the socket types via filters.
	addAction( 'sockets.loadTypes', 'sockets', ( appId ) => {
		const types = applyFilters( 'sockets.socketTypes', SOCKET_TYPES );

		Object.keys( types ).forEach( ( type ) => {
			if ( typeof types[ type ] === 'undefined' ) {
				return;
			}

			const component = types[ type ];
			const uppercased = type.charAt( 0 ).toUpperCase() + type.slice( 1 );

			// @TODO Document this filter.
			addFilter(
				appId + 'Sockets.socketType' + uppercased,
				appId + 'Sockets',
				( _currentComponent, socket ) => {
					return createElement( component, { options: socket } );
				}
			);
		} );
	} );
};

export { registerSocketsActions };
