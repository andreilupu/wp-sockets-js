/**
 * Default entry point — includes the DataViews-backed `dataform` socket.
 *
 * Requires WordPress 7.0+. For WordPress 6.x use `index-legacy.js`
 * (`@andreilupu/wp-sockets-js/legacy`), which is identical except that
 * `dataform` sockets render with the standard socket renderer and DataViews is
 * not bundled at all. See `src/bootstrap.js`.
 */

import './style.scss';

/**
 * Internal dependencies.
 */
import { createSocketsWpRoot, registerBuiltinSockets } from './bootstrap';
import { SocketsWpApp } from './components';
import { DataFormSocket } from './components/sockets/dataform';

import {
	useApiFetchDataHelper,
	useOptionDataHelper,
	useSocketEntities,
	useSocketSetup,
	useUserDataHelper,
} from './hooks';

registerBuiltinSockets( DataFormSocket );

export { createSocketsWpRoot };

export {
	SocketsWpApp,
	useSocketSetup,
	useOptionDataHelper,
	useUserDataHelper,
	useApiFetchDataHelper,
	useSocketEntities,
};

export { DataFormSocket } from './components/sockets/dataform';
export { DataFormLegacySocket } from './components/sockets/dataform-legacy';
export { canUseDataForms } from './dataform/capability';
export {
	compileSockets,
	isCompilable,
	NAMED_CONTROLS,
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
