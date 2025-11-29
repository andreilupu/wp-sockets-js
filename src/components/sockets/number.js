/**
 * WordPress dependencies.
 */
// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
import { __experimentalInputControl as InputControl } from '@wordpress/components';
import { useContext } from '@wordpress/element';
/**
 * Internal dependencies.
 */
import { DataHelperContext } from './../../contexts';

const NumberSocket = ( { options } ) => {
	const { id, label, min, max, step } = options;
	const dataHelper = useContext( DataHelperContext );
	const value = dataHelper.getSetting( id );

	return (
		<InputControl
			label={ label }
			value={ value }
			type="number"
			min={ min }
			max={ max }
			step={ step }
			onChange={ ( nextValue ) => {
				dataHelper.setSetting( id, nextValue );
			} }
		/>
	);
};

export { NumberSocket };
