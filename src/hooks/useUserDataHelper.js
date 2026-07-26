/**
 * WordPress dependencies.
 */
// import { useCallback } from '@wordpress/element';

// import { useEntityRecord } from '@wordpress/core-data'; // I really wish this would work.
import { store as coreDataStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';

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

	/**
	 * Apply several settings in a single edit.
	 *
	 * See the note on `useOptionDataHelper`: calling `setSetting` in a loop
	 * loses all but the last change, because each call spreads the `mergedData`
	 * snapshot captured during the current render.
	 *
	 * @param {Object} settings Map of setting id to value.
	 */
	const setSettings = ( settings ) => {
		if ( ! settings || typeof settings !== 'object' ) {
			return;
		}

		const edits = {
			[ appId ]: {
				...mergedData,
				...settings,
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
		setSettings,
		hasRedo,
		hasUndo,
		// hasUnsavedEdits,
		isSaving,
		redo,
		undo,
	};
};

export { useUserDataHelper };
