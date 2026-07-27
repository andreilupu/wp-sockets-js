/**
 * Entry point for WordPress 6.x — no DataViews.
 *
 * Identical to `index.js` except that `dataform` sockets render with the
 * standard socket renderer. Crucially it never imports
 * `@wordpress/dataviews`, so:
 *
 * - the bundle does not carry DataViews (or its stylesheet), and
 * - the generated asset file does not list `wp-theme`, a handle WordPress 6.8
 *   does not register. That matters more than the file size: WordPress silently
 *   declines to print a script whose declared dependency is missing, and skips
 *   its whole dependency chain, so a page using the default build on 6.x renders
 *   nothing at all.
 *
 * The same socket configuration works against either build, so a plugin can
 * ship both and pick per request. See `Readme.md` for the PHP side.
 */

import './style.scss';

/**
 * Internal dependencies.
 */
import { createSocketsWpRoot, registerBuiltinSockets } from './bootstrap';
import { SocketsWpApp } from './components';
import { DataFormLegacySocket } from './components/sockets/dataform-legacy';

import {
	useApiFetchDataHelper,
	useOptionDataHelper,
	useSocketEntities,
	useSocketSetup,
	useUserDataHelper,
} from './hooks';

registerBuiltinSockets( DataFormLegacySocket );

export { createSocketsWpRoot };

export {
	SocketsWpApp,
	useSocketSetup,
	useOptionDataHelper,
	useUserDataHelper,
	useApiFetchDataHelper,
	useSocketEntities,
};

export { DataFormLegacySocket } from './components/sockets/dataform-legacy';

window.WPSockets = {
	SocketsWpApp,
	createSocketsWpRoot,
	useSocketSetup,
	useOptionDataHelper,
	useUserDataHelper,
	useApiFetchDataHelper,
	useSocketEntities,
};
