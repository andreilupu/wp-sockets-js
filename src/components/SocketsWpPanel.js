import { renderSocket } from './index';

const SocketsWpPanel = ( { sockets } ) => {
	return (
		<div>
			{ sockets.map( ( socket ) => {
				const { id, label, type } = socket;

				return renderSocket( type, socket );
			} ) }
		</div>
	);
};
export default SocketsWpPanel;
