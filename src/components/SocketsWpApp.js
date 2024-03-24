/**
 * WordPress dependencies.
 */
import { applyFilters } from '@wordpress/hooks';

import { Button } from '@wordpress/components';
/**
 * Internal dependencies.
 */
import { AppIdContext, DataHelperContext } from '../contexts';
import { useUserDataHelper, useOptionDataHelper } from './../hocs';
import { renderSocketsWpMode } from './../renders';
import { registerSocketsActions } from './../actions';

const SocketsWpApp = ( { id, sockets, options } ) => {
	const { mode, title } = options;
	registerSocketsActions();

	// @TODO move this to an action that allows the user to pick between saving data to options or user meta. +docs
	const defaultDataHelper = useOptionDataHelper( id );

	// dataHelper should be filtrable, so people can chose to use their own dataHelper with REST API, admin-ajax, etc.
	// the default dataHelper should be a simple object with getSetting, setSetting, saveSettings, etc.
	const dataHelper = applyFilters(
		'sockets_data_helper_'.id,
		defaultDataHelper
	);

	return (
		<AppIdContext.Provider value={ id }>
			<DataHelperContext.Provider value={ dataHelper }>
				{ title && <h1>{ title }</h1> }
				{ renderSocketsWpMode( id, mode, sockets ) }
				<Button variant="secondary" onClick={ dataHelper.saveSettings }>
					Click me to debug!
				</Button>
				;
			</DataHelperContext.Provider>
		</AppIdContext.Provider>
	);
};

export { SocketsWpApp };
