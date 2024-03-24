import { SocketsWpApp } from './components';
import { createSocketsWpRoot } from './utils';

// @TODO: This is just an example. Either the composer package will generate a config for it, or users who decides to use this package will have to create their own config.
// either way we'll remove this.

// @TODO Key points that this need to cover:
// - I should be able to create multiple sockets on the same page.
// - I should be able to import partials from other packages but still to be able to keep it usable.

createSocketsWpRoot( 'sockets_example', {
	selector: '.sockets-example-react-apps',
	// mode: 'panel', // implement this better
	// source: 'options', // implement this: allow the config to decide if we save data to options or user meta
	// datahelper: 'default', // another option would be allowing the config to decide which datahelper to use: 'options', 'usermeta', 'restapi', 'adminajax', etc.
	// withSaveButton: true, // implement this: allow the config to decide if we show the save button or not. without a save button we should save on every change.
	//-  maybe add two buttons since large admin pages might need a save button at the top and bottom.
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
