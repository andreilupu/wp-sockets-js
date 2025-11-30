import { SocketsWpPanel } from './components/SocketsWpPanel';
import { SocketsWpTabs } from './components/SocketsWpTabs';

const renderSocketsWpMode = ( _appId, mode, sockets ) => {
	// @TODO Modes should be filterable as Socket Types are now.
	// doAction( 'sockets.loadModes' );

	switch ( mode ) {
		case 'tabs':
			return <SocketsWpTabs sockets={ sockets } />;
		default:
			return <SocketsWpPanel sockets={ sockets } />;
	}
};

export { renderSocketsWpMode };
