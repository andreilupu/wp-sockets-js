/**
 * WordPress dependencies.
 */
import { CheckboxControl } from '@wordpress/components';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { DataHelperContext } from './../../contexts';
import { useResponsiveOverrides } from './../../hooks';

/**
 * Boolean socket.
 *
 * Exists so a configuration written for the `dataform` socket still renders in
 * full on builds without DataViews: DataForms has a native boolean field, the
 * standard socket renderer did not, and a `checkbox` child would otherwise show
 * "Unknown socket type" on WordPress 6.x.
 *
 * @param {Object} props         Component props.
 * @param {Object} props.options The socket config.
 * @return {Object} The rendered element.
 */
const CheckboxSocket = ( { options } ) => {
	const { id, label, help, style, responsive } = options;
	const dataHelper = useContext( DataHelperContext );
	const overrides = useResponsiveOverrides( responsive );
	const computedStyle = { ...style, ...( overrides.style || {} ) };

	return (
		<div style={ computedStyle } className="wp-sockets-socket-wrapper">
			<CheckboxControl
				__nextHasNoMarginBottom
				label={ label }
				help={ help }
				checked={ !! dataHelper.getSetting( id ) }
				onChange={ ( next ) => dataHelper.setSetting( id, !! next ) }
			/>
		</div>
	);
};

export { CheckboxSocket };
