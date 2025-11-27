/**
 * WordPress dependencies.
 */
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { SocketListContext } from '../contexts';

// import { RenderSocketList } from './RenderSocketList';

const SocketsWpPanel = ( { sockets } ) => {
	const RenderSocketList = useContext( SocketListContext );

	if ( ! RenderSocketList ) {
		return null;
	}

	return (
		<div className="wp-sockets-panel">
			<RenderSocketList sockets={ sockets } />
		</div>
	);
};

export { SocketsWpPanel };
