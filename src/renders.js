/**
 * WordPress dependencies.
 */
import { useContext } from '@wordpress/element';
import { doAction, applyFilters } from '@wordpress/hooks';
/**
 * Internal dependencies.
 */
import { AppIdContext } from './contexts';
import { SocketsWpPanel, SocketsWpTabs } from './components/';

const renderSocketsWpMode = ( appId, mode, sockets ) => {
	doAction( 'sockets.loadTypes', appId );
	// @TODO Modes should be filterable as Socket Types are now.
	// doAction( 'sockets.loadModes' );

	switch ( mode ) {
		case 'tabs':
			return <SocketsWpTabs sockets={ sockets } />;
		case 'panel':
		default:
			return <SocketsWpPanel sockets={ sockets } />;
	}
};

/**
 * Render a socket that has been registered.
 * It will only display sockets that have been registered via `{appId}Sockets.socketType${type}` filter.
 *
 * @param {Object} socket The config object for the socket. It should have a `type` property.
 * @return {Object} The rendered socket.
 */
const useRenderedSocket = ( socket ) => {
	const { type } = socket;
	const appId = useContext( AppIdContext );
	const uppercased = type.charAt( 0 ).toUpperCase() + type.slice( 1 );

	return applyFilters(
		appId + 'Sockets.socketType' + uppercased,
		null,
		socket
	);
};

export { renderSocketsWpMode, useRenderedSocket };
