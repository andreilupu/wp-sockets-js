/**
 * Runtime capability detection for the DataForms renderer.
 *
 * DataViews is bundled into this package because WordPress does not ship it,
 * but it does not stand alone: it borrows a set of shared singletons from the
 * host page (`@wordpress/components`, `private-apis`, `theme`, …). Those cannot
 * be bundled away — `components` is stateful (slot-fill registry, private-API
 * lock, theme context) and a second copy breaks the page, while re-registering
 * an already-present package with `private-apis` throws outright.
 *
 * The practical consequence is a floor. `wp-theme` is the marker: WordPress 7.0
 * ships it, 6.8 does not, and it is exactly what DataViews' dependency chain
 * needs. So rather than comparing WordPress version numbers — which would get
 * the answer wrong on a site running the Gutenberg plugin over an older core —
 * check for the capability itself.
 */

/**
 * WordPress dependencies.
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Globals DataViews needs the host to provide.
 *
 * Deliberately the shared, stateful ones. Anything WordPress does not ship
 * (`dataviews`, `ui`, `icons`) is bundled and so is never checked here.
 */
const REQUIRED_GLOBALS = [
	'components',
	'element',
	'data',
	'privateApis',
	'theme',
];

/**
 * Can this WordPress render the DataForms-based socket?
 *
 * @return {boolean} True when every required host global is present.
 */
export const canUseDataForms = () => {
	const wp = typeof window !== 'undefined' ? window.wp : undefined;

	const supported =
		!! wp && REQUIRED_GLOBALS.every( ( name ) => !! wp[ name ] );

	/**
	 * Filters whether the DataForms renderer is used.
	 *
	 * Escape hatch in both directions: force the legacy renderer on a
	 * supported site, or opt in on a site whose capabilities cannot be
	 * detected this way.
	 *
	 * @param {boolean} supported Result of the capability check.
	 */
	return !! applyFilters( 'wpSockets.canUseDataForms', supported );
};
