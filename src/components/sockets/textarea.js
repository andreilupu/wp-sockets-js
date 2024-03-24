/**
 * WordPress dependencies.
 */
import { TextareaControl } from '@wordpress/components';
import { useContext } from '@wordpress/element';
/**
 * Internal dependencies.
 */
import { DataHelperContext } from './../../contexts';

const TextareaSocket = ( { options } ) => {
	const { id, label } = options;
	const dataHelper = useContext( DataHelperContext );
	const value = dataHelper.getSetting( id );

	return (
		<TextareaControl
			label={ label }
			value={ value }
			onChange={ ( nextValue ) => {
				dataHelper.setSetting( id, nextValue );
			} }
		/>
	);
};

export { TextareaSocket };
