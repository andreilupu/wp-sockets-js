/**
 * WordPress dependencies.
 */
import { useContext } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies.
 */
import { AppIdContext } from './../contexts';

/**
 * Render a socket that has been registered.
 * It will only display sockets that have been registered via `{appId}Sockets.socketType${type}` filter.
 *
 * @param {Object} props        The component props.
 * @param {Object} props.socket The config object for the socket. It should have a `type` property.
 * @return {Object} The rendered socket.
 */
const RenderedSocket = ( { socket } ) => {
	const { type } = socket;
	const appId = useContext( AppIdContext );
	const uppercased = type.charAt( 0 ).toUpperCase() + type.slice( 1 );

	const result = applyFilters(
		`${ appId }Sockets.socketType${ uppercased }`,
		null,
		socket
	);

	if ( result === null ) {
		return (
			<div className="notice notice-warning inline">
				<p>
					Unknown socket type: <code>{ type }</code>
				</p>
			</div>
		);
	}

	return result;
};

export { RenderedSocket };
