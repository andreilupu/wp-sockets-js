/**
 * WordPress dependencies.
 */
import { Button } from '@wordpress/components';
import { createElement } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies.
 */
import SocketsWpPanel from './SocketsWpPanel';
import { AppIdContext, DataHelperContext } from '../contexts';
import { TextSocket } from './sockets/text';
import { useDataHelper } from './../hocs';

const renderSocketsWpMode = ( mode, sockets ) => {
	switch ( mode ) {
		case 'tabs':
			return <SocketsWpTabs sockets={ sockets } />;
			break;
		case 'panel':
		default:
			return <SocketsWpPanel sockets={ sockets } />;
	}
};

const renderSocket = ( type, socket ) => {

	// @TODO - This is a placeholder for now, we need to figure out how to dynamically create the component
	// const ComponentName = createElement(type.charAt(0).toUpperCase() + type.slice(1) + 'Socket');
	// return (
	// 	<fieldset>
	// 		<ComponentName options={ socket } />
	// 	</fieldset>
	// );

	// @TODO or we can use a switch statement for now.
	switch ( type ) {
		case 'text':
			return (
				<fieldset>
					<TextSocket options={ socket } />
				</fieldset>
			);
			break;
		case 'textarea':
			return (
				<fieldset>
					<label htmlFor={ socket.id }>{ socket.label }</label>
					<textarea id={ socket.id } />
				</fieldset>
			);
			break;
		default:
			return <p>Unknown socket type</p>;
	}
};

const SocketsWpApp = ( { id, sockets, options } ) => {
	const { mode, title } = options;

	const defaultDataHelper = useDataHelper(id);

	// dataHelper should be filtrable, so people can chose to use their own dataHelper with REST API, admin-ajax, etc.
	// the default dataHelper should be a simple object with getSetting, setSetting, saveSettings, etc.
	const dataHelper = applyFilters( 'sockets_data_helper_' . id, defaultDataHelper );

	return (
		<AppIdContext.Provider value={ id }>
			<DataHelperContext.Provider value={dataHelper}>
				{ title && <h1>{ title }</h1> }
				{ renderSocketsWpMode( mode, sockets ) }
				<Button variant="secondary" onClick={dataHelper.saveSettings}>Click me to debug!</Button>;
			</DataHelperContext.Provider>
		</AppIdContext.Provider>
	);
};

export { SocketsWpApp, renderSocketsWpMode, renderSocket };
