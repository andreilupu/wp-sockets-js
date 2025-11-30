/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies.
 */
import { Button, __experimentalGrid as Grid } from '@wordpress/components';
import { useContext, useMemo } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { DataHelperContext, SocketListContext } from '../../contexts';

const RepeaterRow = ( {
	item,
	index,
	id,
	parentDataHelper,
	computedGrid,
	children,
	removeItem,
} ) => {
	const RenderSocketList = useContext( SocketListContext );

	// Create a scoped data helper for this row
	const rowDataHelper = useMemo(
		() => ( {
			...parentDataHelper,
			getSetting: ( childId ) => {
				return item[ childId ];
			},
			setSetting: ( childId, value ) => {
				// We need to get the latest items from the parent helper to avoid stale closures
				// However, since we are inside a component that receives `item` and `index`,
				// we might need to be careful.
				// Actually, the cleanest way is to trigger an update on the parent.
				// But we need the current list of items.
				// Let's rely on the parentDataHelper.getSetting(id) to get the fresh list.
				const currentItems = parentDataHelper.getSetting( id ) || [];
				const newItems = [ ...currentItems ];
				newItems[ index ] = {
					...newItems[ index ],
					[ childId ]: value,
				};
				parentDataHelper.setSetting( id, newItems );
			},
		} ),
		[ parentDataHelper, item, index, id ]
	);

	return (
		<DataHelperContext.Provider value={ rowDataHelper }>
			<div className="wp-sockets-repeater__row">
				<div className="wp-sockets-repeater__row-content">
					{ computedGrid ? (
						<Grid
							columns={ computedGrid.columns }
							gap={ computedGrid.gap }
						>
							<RenderSocketList sockets={ children } />
						</Grid>
					) : (
						<RenderSocketList sockets={ children } />
					) }
				</div>
				<div className="wp-sockets-repeater__row-actions">
					<Button
						variant="secondary"
						isDestructive
						onClick={ () => removeItem( index ) }
					>
						Remove Row
					</Button>
				</div>
			</div>
		</DataHelperContext.Provider>
	);
};

export default RepeaterRow;
