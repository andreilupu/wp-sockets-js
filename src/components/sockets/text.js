// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
import { __experimentalInputControl as InputControl } from '@wordpress/components';
import { useContext } from '@wordpress/element';
import { DataHelperContext } from './../../contexts';

const TextSocket = ( { options } ) => {
	const { id, label } = options;
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
