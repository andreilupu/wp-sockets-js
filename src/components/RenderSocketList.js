/**
 * Internal dependencies.
 */
import { RenderedSocket } from './RenderedSocket';

import { SocketErrorBoundary } from './SocketErrorBoundary';

const RenderSocketList = ( { sockets } ) => {
	if ( ! Array.isArray( sockets ) || sockets.length === 0 ) {
		return null;
	}

	return (
		<>
			{ sockets.map( ( socket ) => {
				if ( ! RenderedSocket ) {
					return null;
				}
				return (
					<SocketErrorBoundary key={ socket.id }>
						<RenderedSocket socket={ socket } />
					</SocketErrorBoundary>
				);
			} ) }
		</>
	);
};

export { RenderSocketList };
