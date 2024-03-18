import { useCallback } from 'react';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEntityRecord, store as coreStore } from '@wordpress/core-data';

/**
 * @TODO Describe the consept of the dataHelper since this can be filtered and used diferently.
 *
 * @returns
 */
const useDataHelper = () => {
	const { saveEntityRecord, undo, redo } = useDispatch( 'core' );
	const {
		record: savedSettings,
		isResolving: isLoadingSettings,
		hasResolved: ready,
	} = useEntityRecord( 'root', 'site' );
	const hasUnsavedEdits = savedSettings && Object.keys( savedSettings ).length > 0;
	const isSaving = useSelect( select => select( 'core' ).isSavingEntityRecord( 'root', 'site' ) );
	const hasRedo = useSelect( select => select( 'core' ).hasUndo() );
	const hasUndo = useSelect( select => select( 'core' ).hasRedo() );

	const getSetting = (settingId) => {
		if (!ready) {
			return null;
		}

		return typeof savedSettings[settingId] !== 'undefined' ? savedSettings[settingId] : null;
	}

	const setSetting = (settingId, value) => {
		savedSettings[settingId] = value;

		// save to the server?

		// or just save to records and wait for the Save button to be clicked?
	}

	const saveSettings = () => {
		let newSettings = { sockets_example: { ...savedSettings.sockets_example, x: '111' } };

		return saveEntityRecord( 'root', 'site', newSettings);
	};

	return {
		saveSettings,
		savedSettings,
		getSetting,
		setSetting,
		hasRedo,
		hasUndo,
		hasUnsavedEdits,
		isSaving,
		redo,
		undo,
	};
}

export {
	useDataHelper
}
