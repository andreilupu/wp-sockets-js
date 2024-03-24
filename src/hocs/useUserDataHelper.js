/**
 * WordPress dependencies.
 */
// import { useCallback } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
// import { useEntityRecord } from '@wordpress/core-data'; // I really wish this would work.
import { store as coreDataStore } from '@wordpress/core-data';

/**
 * Desc:
 *
 * @param {string} appId The app id. Crucial to sanitize this because it will be the key under which we'll save data.
 * @return {Object} dataHelper
 */
const useUserDataHelper = ( appId ) => {
	const { saveEntityRecord, undo, redo, editEntityRecord } =
		useDispatch( coreDataStore );

	const { userId, record, editedEntities, isSaving } = useSelect(
		( select ) => {
			const _userId = select( 'core' ).getCurrentUser().id;
			const _record = select( 'core' ).getEntityRecord(
				'root',
				'user',
				_userId
			);
			const edits = select( 'core' ).getEntityRecordEdits(
				'root',
				'user',
				_userId
			);

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
				isSaving: select( 'core' ).isSavingEntityRecord(
					'root',
					'user'
				),
				userId: _userId,
			};
		}
	);

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

		editEntityRecord( 'root', 'user', userId, edits );
	};

	const saveSettings = () => {
		return saveEntityRecord(
			'root',
			'user',
			{ id: userId, [ appId ]: mergedData },
			{ throwOnError: true }
		);
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

export { useUserDataHelper };
