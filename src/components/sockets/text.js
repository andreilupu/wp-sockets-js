import { __experimentalInputControl as InputControl } from '@wordpress/components';
import { useContext } from '@wordpress/element';
import { AppIdContext, DataHelperContext } from './../../contexts';

const TextSocket = ( { options } ) => {
	const { id, label } = options;
	// const appId = useContext( AppIdContext ); // not actually needed, right?
	const dataHelper = useContext( DataHelperContext );
	const value = dataHelper.getSetting( id );

	return (
		<InputControl
			label={ label }
			value={ value }
			onChange={ ( nextValue ) => {
				dataHelper.setSetting( id, nextValue );
			} }
		/>
	);
};

export { TextSocket };
