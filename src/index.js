import { SocketsWpApp } from './components';
import { createSocketsWpRoot } from './utils';

createSocketsWpRoot( 'sockets_example', {
	selector: '.sockets-example-react-apps',
	sockets: [
		{
			id: 'text_example',
			type: 'text',
			label: 'Text',
		},
		{
			id: 'textarea_example',
			type: 'textarea',
			label: 'Textarea',
		},
	],
} );

export { SocketsWpApp, createSocketsWpRoot };
