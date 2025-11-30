/**
 * WordPress dependencies.
 */

import { Card, CardBody, TabPanel } from '@wordpress/components';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { SocketListContext } from '../contexts';

const SocketsWpTabs = ({ sockets }) => {
	const RenderSocketList = useContext(SocketListContext);

	if (!sockets || sockets.length === 0) {
		return null;
	}

	const tabs = sockets.map((socket) => ({
		name: socket.id,
		title: socket.title || socket.label || socket.id,
		className: `socket-tab-${socket.id}`,
		// Pass the original socket data along so we can use it in the render function
		socketData: socket,
	}));

	return (
		<TabPanel
			className="wp-sockets-tabs"
			activeClass="is-active"
			tabs={tabs}
		>
			{(tab) => {
				const socket = tab.socketData;
				// If the socket has children, render them.
				// Otherwise, render the socket itself as the content.
				const contentSockets = socket.children
					? socket.children
					: [socket];

				return (
					<div className="tab-content" key={socket.id}>
						<Card>
							<CardBody>
								<RenderSocketList sockets={contentSockets} />
							</CardBody>
						</Card>
					</div>
				);
			}}
		</TabPanel>
	);
};

export { SocketsWpTabs };
