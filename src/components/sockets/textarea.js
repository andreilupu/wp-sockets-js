/**
 * WordPress dependencies.
 */
import { BaseControl, TextareaControl } from '@wordpress/components';
import { useContext } from '@wordpress/element';
/**
 * Internal dependencies.
 */
import { DataHelperContext } from './../../contexts';
import { useResponsiveOverrides } from './../../hooks';

const TextareaSocket = ( { options } ) => {
	const { id, label, style, responsive } = options;
	const dataHelper = useContext( DataHelperContext );
	const value = dataHelper.getSetting( id ) || '';
	const overrides = useResponsiveOverrides( responsive );
	const computedStyle = { ...style, ...( overrides.style || {} ) };

	return (
		<div style={ computedStyle } className="wp-sockets-socket-wrapper">
			<BaseControl label={ label } id={ id }>
				<TextareaControl
					value={ value }
					onChange={ ( nextValue ) => {
						dataHelper.setSetting( id, nextValue );
					} }
				/>
			</BaseControl>
		</div>
	);
};

export { TextareaSocket };
