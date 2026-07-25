import './style.scss';
import { createElement, createRoot } from '@wordpress/element';
import { addAction, addFilter } from '@wordpress/hooks';
import { SocketsWpApp } from './components';
import { RenderSocketList } from './components/RenderSocketList';
import { DataFormSocket } from './components/sockets/dataform';
import { Group } from './components/sockets/group';
import { NumberSocket } from './components/sockets/number';
import { RepeaterSocket } from './components/sockets/repeater';
import { TextSocket } from './components/sockets/text';
import { TextareaSocket } from './components/sockets/textarea';

import {
	useApiFetchDataHelper,
	useOptionDataHelper,
	useSocketEntities,
	useSocketSetup,
	useUserDataHelper,
} from './hooks';

export const createSocketsWpRoot = (id, options) => {
	const selector = options.selector || `#wp-sockets-root-${id}`;
	const element = document.querySelector(selector);

	if (!element) {
		return;
	}

	const root = createRoot(element);
	root.render(
		<SocketsWpApp
			id={id}
			sockets={options.sockets}
			options={options}
			RenderSocketList={RenderSocketList}
		/>
	);
};

// Register sockets directly here

const registerSocketType = (appId, type, component) => {
	const uppercased = type.charAt(0).toUpperCase() + type.slice(1);
	addFilter(
		`${appId}Sockets.socketType${uppercased}`,
		`${appId}Sockets`,
		(_currentComponent, socket) => {
			return createElement(component, { options: socket });
		}
	);
};

addAction('sockets.loadTypes', 'sockets', (appId) => {
	registerSocketType(appId, 'text', TextSocket);
	registerSocketType(appId, 'textarea', TextareaSocket);
	registerSocketType(appId, 'number', NumberSocket);
	registerSocketType(appId, 'group', Group);
	registerSocketType(appId, 'repeater', RepeaterSocket);
	// Renders its children through core's DataForm. Opt-in per socket, so a
	// page can migrate to DataForms one section at a time.
	registerSocketType(appId, 'dataform', DataFormSocket);
});

export {
	SocketsWpApp,
	useSocketSetup,
	useOptionDataHelper,
	useUserDataHelper,
	useApiFetchDataHelper,
	useSocketEntities,
};

export { DataFormSocket } from './components/sockets/dataform';
export {
	compileSockets,
	isCompilable,
	NATIVE_TYPE_MAP,
	UNSUPPORTED_TYPES,
} from './dataform/compile';

window.WPSockets = {
	SocketsWpApp,
	createSocketsWpRoot,
	useSocketSetup,
	useOptionDataHelper,
	useUserDataHelper,
	useApiFetchDataHelper,
	useSocketEntities,
};
