/**
 * WordPress dependencies.
 */
import { useDebounce } from '@wordpress/compose';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import {
	AppIdContext,
	DataHelperContext,
	SocketListContext,
} from './../contexts';
import { useOptionDataHelper, useSocketSetup } from './../hooks';
import { renderSocketsWpMode } from './../renders';

const SocketsWpApp = ( { id, sockets, options, RenderSocketList } ) => {
	const { mode, title, withSaveButton, autosave } = options;
	const isReady = useSocketSetup( id );

	// @TODO move this to an action that allows the user to pick between saving data to options or user meta. +docs
	const defaultDataHelper = useOptionDataHelper( id );

	const saveData = () => {
		defaultDataHelper.saveSettings();
	};

	const debouncedSave = useDebounce( saveData, 1000 );

	useEffect( () => {
		if (
			autosave &&
			defaultDataHelper.hasUnsavedEdits &&
			! defaultDataHelper.isSaving
		) {
			debouncedSave();
		}
	}, [
		autosave,
		defaultDataHelper.hasUnsavedEdits,
		defaultDataHelper.isSaving,
		debouncedSave,
	] );

	if ( ! isReady ) {
		return <div>Loading...</div>;
	}

	return (
		<AppIdContext.Provider value={ id }>
			<DataHelperContext.Provider value={ defaultDataHelper }>
				<SocketListContext.Provider value={ RenderSocketList }>
					<div
						className="wp-sockets-app"
						style={ { position: 'relative' } }
					>
						{ defaultDataHelper.isSaving && (
							<div
								style={ {
									position: 'absolute',
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									backgroundColor: 'rgba(255, 255, 255, 0.6)',
									zIndex: 100,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									cursor: 'wait',
								} }
							>
								<span
									className="spinner is-active"
									style={ { float: 'none', margin: 0 } }
								></span>
							</div>
						) }
						<div className="wp-sockets-header">
							<h1>{ title }</h1>
							{ withSaveButton && (
								<button
									type="button"
									className="button button-primary"
									onClick={ saveData }
									disabled={ defaultDataHelper.isSaving }
								>
									{ defaultDataHelper.isSaving
										? 'Saving...'
										: 'Save' }
								</button>
							) }
						</div>
						<div
							style={ {
								opacity: defaultDataHelper.isSaving ? 0.5 : 1,
								pointerEvents: defaultDataHelper.isSaving
									? 'none'
									: 'auto',
							} }
						>
							{ renderSocketsWpMode( id, mode, sockets ) }
						</div>
					</div>
				</SocketListContext.Provider>
			</DataHelperContext.Provider>
		</AppIdContext.Provider>
	);
};

export { SocketsWpApp };
