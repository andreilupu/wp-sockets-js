/**
 * WordPress dependencies.
 */
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { useRenderedSocket } from './../renders';

const SocketsWpPanel = ( { sockets, withSaveButton } ) => {
	return (
		<div>
			{ sockets.map( ( socket ) => {
				return useRenderedSocket( socket );
			} ) }
			{ withSaveButton && (
				<Button
					variant="primary"
					// onClick={ dataHelper.saveSettings }
					// isBusy={ dataHelper.isSaving }
				>
					{ __( 'Save' ) }
				</Button>
			) }
		</div>
	);
};

export {
	SocketsWpPanel
};
