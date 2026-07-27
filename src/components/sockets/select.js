/**
 * WordPress dependencies.
 */
import { SelectControl } from '@wordpress/components';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { DataHelperContext } from './../../contexts';
import { useResponsiveOverrides } from './../../hooks';

/**
 * Choice socket.
 *
 * The counterpart to a DataForms field with `elements`, so a configuration
 * written for the `dataform` socket still renders in full on builds without
 * DataViews. Accepts the same `choices` shape the DataForms compiler does:
 * plain values, or `{ value, label }` objects.
 *
 * A function is not supported here — asynchronous option lists are a DataForms
 * feature (`getElements`), and resolving them would mean duplicating that
 * machinery in the legacy renderer. Such a socket renders an empty select rather
 * than failing.
 *
 * @param {Object} props         Component props.
 * @param {Object} props.options The socket config.
 * @return {Object} The rendered element.
 */
const SelectSocket = ( { options } ) => {
	const { id, label, help, choices, style, responsive } = options;
	const dataHelper = useContext( DataHelperContext );
	const overrides = useResponsiveOverrides( responsive );
	const computedStyle = { ...style, ...( overrides.style || {} ) };

	const list = Array.isArray( choices ) ? choices : [];
	const selectOptions = [
		{ value: '', label: '—' },
		...list.map( ( choice ) =>
			choice && typeof choice === 'object'
				? {
						value: choice.value,
						label: choice.label ?? choice.value,
				  }
				: { value: choice, label: String( choice ) }
		),
	];

	return (
		<div style={ computedStyle } className="wp-sockets-socket-wrapper">
			<SelectControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ label }
				help={ help }
				value={ dataHelper.getSetting( id ) ?? '' }
				options={ selectOptions }
				onChange={ ( next ) => dataHelper.setSetting( id, next ) }
			/>
		</div>
	);
};

export { SelectSocket };
