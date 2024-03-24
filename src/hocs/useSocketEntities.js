import { useSelect, useDispatch } from '@wordpress/data';
import { useCallback } from '@wordpress/element';

/**
 * Fetches relevant entity record states for use in the configurator.
 * // @TODO: inspired from Jetpack's useEntityRecordState. Maybe we should use that instead?
 *
 * @return {Object} relevant entity record values.
 */
const useSocketEntities = () => {
	const { redo, saveEntityRecord, undo } = useDispatch( 'core' );
	const editedEntities = useSelect( ( select ) =>
		select( 'core' ).getEntityRecordEdits( 'root', 'site' )
	);
	const hasUnsavedEdits =
		editedEntities && Object.keys( editedEntities ).length > 0;

	const isSaving = useSelect( ( select ) =>
		select( 'core' ).isSavingEntityRecord( 'root', 'site' )
	);
	const hasRedo = useSelect( ( select ) => select( 'core' ).hasUndo() );
	const hasUndo = useSelect( ( select ) => select( 'core' ).hasRedo() );

	const saveRecords = useCallback( () => {
		return (
			hasUnsavedEdits &&
			saveEntityRecord( 'root', 'site', editedEntities )
		);
	}, [ editedEntities, hasUnsavedEdits, saveEntityRecord ] );

	return {
		editedEntities,
		hasRedo,
		hasUndo,
		hasUnsavedEdits,
		isSaving,
		redo,
		saveRecords,
		undo,
	};
};

export { useSocketEntities };
