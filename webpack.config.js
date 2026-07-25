/**
 * Build config for the WordPress-facing bundle (`build/`, consumed by the PHP
 * bridge). Extends `@wordpress/scripts` with two changes needed by the
 * DataForms socket.
 *
 * ## 1. Keep the asset file's dependencies portable
 *
 * `@wordpress/dataviews` is not shipped by WordPress at runtime — it is neither
 * a script module nor a `window.wp.*` global — so it has to be bundled.
 * `dependency-extraction-webpack-plugin` already knows this (dataviews and
 * icons are in its `BUNDLED_PACKAGES` list), so that part needs no help.
 *
 * Its *dependencies* are a different matter. DataViews pulls in
 * `@wordpress/ui`, which DEWP externalizes to a `wp-ui` script handle. That
 * handle only exists in very recent WordPress, while this framework supports
 * WordPress 6.0+. A missing handle is not a soft failure: WordPress skips the
 * whole dependency chain, so the entire admin page silently renders nothing.
 * Bundling it instead keeps the generated asset file limited to handles that
 * have existed for years.
 *
 * Returning a defined-but-falsy value from `requestToExternal` is the
 * documented-by-source way to force bundling: it suppresses DEWP's default
 * cascade without registering an external.
 *
 * ## 2. Emit the DataViews stylesheet
 *
 * `@wordpress/dataviews` declares `"sideEffects": false`, so webpack
 * tree-shakes a stylesheet-only import out of the graph — silently, with no
 * error and no emitted CSS. Marking CSS as side-effectful keeps it.
 */

const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );

/**
 * Requests that must be bundled rather than externalized.
 *
 * - `@wordpress/ui`: see note 1 above — DEWP would emit a `wp-ui` handle that
 *   does not exist on the WordPress versions this framework supports.
 * - `@wordpress/dataviews/*` subpaths: DEWP's `BUNDLED_PACKAGES` covers the
 *   package root but not deep imports, so the stylesheet import would otherwise
 *   be turned into a nonsense script dependency
 *   (`wp-dataviews/build-style/style.css`) — which, being unregistered, would
 *   stop WordPress printing the whole chain.
 *
 * @param {string} request Requested module.
 * @return {boolean} True when the request must be bundled.
 */
const mustBundle = ( request ) =>
	request === '@wordpress/ui' ||
	request.startsWith( '@wordpress/dataviews/' );

module.exports = {
	...defaultConfig,
	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,
			// See note 2 above.
			{ test: /\.css$/i, sideEffects: true },
		],
	},
	plugins: [
		// Replace the default DEWP instance with one that force-bundles the
		// packages above. Filtering by constructor name rather than identity
		// because wp-scripts constructs its own instance.
		...defaultConfig.plugins.filter(
			( plugin ) =>
				plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
		),
		new DependencyExtractionWebpackPlugin( {
			requestToExternal( request ) {
				if ( mustBundle( request ) ) {
					// Defined but falsy: skip the default cascade, bundle it.
					return null;
				}
				// Undefined: use DEWP's default handling.
				return undefined;
			},
		} ),
	],
};
