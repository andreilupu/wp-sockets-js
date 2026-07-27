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

const path = require( 'path' );
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

/**
 * Build one variant.
 *
 * Each variant is a separate webpack compilation rather than a second entry in
 * one config. Two entries would share a single extracted stylesheet, so the
 * legacy build would inherit the DataViews CSS it has no use for; separate
 * compilations keep the two sets of assets genuinely independent, which is what
 * we want given only one of them is ever loaded.
 *
 * @param {string} name Entry name, matching a file in `src/`.
 * @return {Object} A webpack configuration.
 */
const variant = ( name ) => ( {
	...defaultConfig,
	name,
	entry: { [ name ]: path.resolve( __dirname, `src/${ name }.js` ) },
	output: {
		...defaultConfig.output,
		/*
		 * Both variants write to the same directory, and wp-scripts enables
		 * `clean`. Left on, whichever compilation finishes last deletes the
		 * other's output — silently, since both still report success. The npm
		 * script empties the directory once before building instead.
		 */
		clean: false,
	},
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
		// because wp-scripts constructs its own instance. A fresh instance per
		// variant, since a plugin instance cannot be shared across compilations.
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
} );

/*
 * Two builds from the same source:
 *
 * - `index`        includes the DataViews-backed `dataform` socket and needs
 *                  WordPress 7.0+.
 * - `index-legacy` renders `dataform` sockets with the standard socket renderer
 *                  and never imports DataViews, so it runs on WordPress 6.x —
 *                  its asset file does not list `wp-theme`, the missing handle
 *                  that otherwise stops the script loading there.
 */
module.exports = [ variant( 'index' ), variant( 'index-legacy' ) ];
