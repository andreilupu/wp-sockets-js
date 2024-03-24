/**
 * WordPress dependencies.
 */
// import { useCallback } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';

/**
 * Desc: @TODO Describe the consept of the dataHelper since this can be filtered and used diferently.
 *
 * @param {string} appId The app id. Crucial to sanitize this because it will be the key under which we'll save data.
 * @return {Object} dataHelper
 */
const useOptionDataHelper = ( appId ) => {
	const { saveEntityRecord, undo, redo, editEntityRecord } =
		useDispatch( coreDataStore );
	// can't make this work.
	// const {
	// 	record,
	// 	isResolving: isLoadingSettings,
	// 	hasResolved: ready,
	// 	status,
	// } = useEntityRecord( 'root', 'site' );

	const { record, editedEntities, isSaving } = useSelect( ( select ) => {
		const _record = select( 'core' ).getEntityRecord( 'root', 'site' );
		const edits = select( 'core' ).getEntityRecordEdits( 'root', 'site' );

		// we care only about settings under our appId.
		return {
			record:
				_record && typeof _record[ appId ] !== 'undefined'
					? _record[ appId ]
					: null,
			editedEntities:
				edits && typeof edits[ appId ] !== 'undefined'
					? edits[ appId ]
					: null,
			isSaving: select( 'core' ).isSavingEntityRecord( 'root', 'site' ),
		};
	} );

	const mergedData = { ...record, ...editedEntities };

	// const hasUnsavedEdits = record && Object.keys( record ).length > 0;
	const hasRedo = useSelect( ( select ) => select( 'core' ).hasUndo() );
	const hasUndo = useSelect( ( select ) => select( 'core' ).hasRedo() );

	const getSetting = ( settingId ) => {
		if (
			isSaving ||
			typeof mergedData === 'undefined' ||
			Object.keys( mergedData ).length < 1
		) {
			return null;
		}

		if ( typeof mergedData[ settingId ] === 'undefined' ) {
			return null;
		}

		return mergedData[ settingId ];
	};

	const setSetting = ( settingId, value ) => {
		const edits = {
			[ appId ]: {
				...mergedData, // @TODO meh
				[ settingId ]: value,
			},
		};
		editEntityRecord( 'root', 'site', undefined, edits );
	};

	const saveSettings = () => {
		return saveEntityRecord( 'root', 'site', { [ appId ]: mergedData } );
	};

	return {
		saveSettings,
		getSetting,
		setSetting,
		hasRedo,
		hasUndo,
		// hasUnsavedEdits,
		isSaving,
		redo,
		undo,
	};
};

export { useOptionDataHelper };
