import { TextareaControl } from '@wordpress/components';
import { useContext } from '@wordpress/element';
import { AppIdContext, DataHelperContext } from './../../contexts';

const TextareaSocket = ( { options } ) => {
	const { id, label } = options;
	// const appId = useContext( AppIdContext ); // not actually needed, right?
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
