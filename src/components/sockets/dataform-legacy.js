/**
 * WordPress dependencies.
 */
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { SocketListContext } from './../../contexts';

/**
 * `dataform` socket for builds without DataViews.
 *
 * Renders the children with the standard socket renderer, which is possible
 * because `dataform` is a presentation choice and not a data contract: its
 * children are ordinary sockets writing to the same value namespace, so one
 * configuration renders correctly either way. A page built for WordPress 7.0
 * therefore also works on 6.x, with plain controls instead of a DataForm.
 *
 * Deliberately in its own module with no `@wordpress/dataviews` import, so the
 * legacy bundle does not pull DataViews in — that import is what would add the
 * `wp-theme` script dependency and stop the script loading on 6.x entirely.
 *
 * @param {Object} props         Component props.
 * @param {Object} props.options The socket config.
 * @return {Object} The rendered element.
 */
const DataFormLegacySocket = ( { options } ) => {
	const { children, label } = options;
	const RenderSocketList = useContext( SocketListContext );

	return (
		<div className="wp-sockets-dataform wp-sockets-dataform--legacy">
			{ label && <h3>{ label }</h3> }
			{ RenderSocketList && <RenderSocketList sockets={ children } /> }
		</div>
	);
};

export { DataFormLegacySocket };
