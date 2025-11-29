/* eslint-disable no-console, @wordpress/no-unsafe-wp-apis */
import {
	BaseControl,
	__experimentalInputControl as InputControl,
} from '@wordpress/components';
import { useContext } from '@wordpress/element';
import { DataHelperContext } from './../../contexts';
import { useResponsiveOverrides } from './../../hooks';

const TextSocket = ( { options } ) => {
	const { id, label, style, responsive } = options;
	const dataHelper = useContext( DataHelperContext );
	const value = dataHelper.getSetting( id ) || '';
	const overrides = useResponsiveOverrides( responsive );
	const computedStyle = { ...style, ...( overrides.style || {} ) };

	return (
		<div style={ computedStyle } className="wp-sockets-socket-wrapper">
			<BaseControl label={ label } id={ id }>
				<InputControl
					value={ value }
					onChange={ ( nextValue ) => {
						dataHelper.setSetting( id, nextValue );
					} }
				/>
			</BaseControl>
		</div>
	);
};

export { TextSocket };
