/**
 * Shared bootstrap for both distribution builds.
 *
 * The library ships in two flavours, because DataViews cannot run on every
 * supported WordPress:
 *
 * - `index.js` registers the real DataForms renderer. It needs WordPress 7.0+,
 *   since DataViews' dependency chain requires the `wp-theme` script handle.
 * - `index-legacy.js` registers a `dataform` socket that renders its children
 *   with the standard socket renderer. It never imports `@wordpress/dataviews`,
 *   so the bundle is small and its generated asset file only lists handles that
 *   have existed for years — it runs on WordPress 6.x.
 *
 * Everything else is identical, so it lives here rather than being duplicated.
 * The two entry points differ by one argument.
 *
 * Only one of the two is ever loaded on a page, which is what makes this
 * approach safe: two separate bundles would otherwise each carry their own copy
 * of the React contexts, and a socket in one could not see the data helper
 * provided by the other.
 */

/**
 * WordPress dependencies.
 */
import { createElement, createRoot } from '@wordpress/element';
import { addAction, addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies.
 */
import { SocketsWpApp } from './components';
import { RenderSocketList } from './components/RenderSocketList';
import { CheckboxSocket } from './components/sockets/checkbox';
import { Group } from './components/sockets/group';
import { NumberSocket } from './components/sockets/number';
import { RepeaterSocket } from './components/sockets/repeater';
import { SelectSocket } from './components/sockets/select';
import { TextSocket } from './components/sockets/text';
import { TextareaSocket } from './components/sockets/textarea';

/**
 * Mount a sockets app into the DOM.
 *
 * @param {string} id      App id, also the key settings are stored under.
 * @param {Object} options App configuration.
 */
export const createSocketsWpRoot = ( id, options ) => {
	const selector = options.selector || `#wp-sockets-root-${ id }`;
	const element = document.querySelector( selector );

	if ( ! element ) {
		return;
	}

	const root = createRoot( element );
	root.render(
		<SocketsWpApp
			id={ id }
			sockets={ options.sockets }
			options={ options }
			RenderSocketList={ RenderSocketList }
		/>
	);
};

/**
 * Register a component as the renderer for a socket type.
 *
 * @param {string}   appId     The app id.
 * @param {string}   type      Socket type.
 * @param {Function} component Component rendering that type.
 */
const registerSocketType = ( appId, type, component ) => {
	const uppercased = type.charAt( 0 ).toUpperCase() + type.slice( 1 );
	addFilter(
		`${ appId }Sockets.socketType${ uppercased }`,
		`${ appId }Sockets`,
		( _currentComponent, socket ) => {
			return createElement( component, { options: socket } );
		}
	);
};

/**
 * Register the built-in socket types.
 *
 * @param {Function} DataFormImpl Component to register for the `dataform` type.
 *                                Either the DataViews-backed renderer or the
 *                                fallback, depending on the build.
 */
export const registerBuiltinSockets = ( DataFormImpl ) => {
	addAction( 'sockets.loadTypes', 'sockets', ( appId ) => {
		registerSocketType( appId, 'text', TextSocket );
		registerSocketType( appId, 'textarea', TextareaSocket );
		registerSocketType( appId, 'number', NumberSocket );
		registerSocketType( appId, 'group', Group );
		registerSocketType( appId, 'repeater', RepeaterSocket );
		// Counterparts to DataForms' boolean and choice fields, so a config
		// written for `dataform` renders in full without DataViews too.
		registerSocketType( appId, 'checkbox', CheckboxSocket );
		registerSocketType( appId, 'select', SelectSocket );
		registerSocketType( appId, 'dataform', DataFormImpl );
	} );
};
