/**
 * WordPress dependencies.
 */

import { BaseControl, Button } from '@wordpress/components';
/* eslint-disable no-console, @wordpress/no-unsafe-wp-apis */
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { DataHelperContext, SocketListContext } from '../../contexts';
import { useResponsiveOverrides } from '../../hooks';
import RepeaterRow from './RepeaterRow';

const RepeaterSocket = ( { options } ) => {
	const { id, label, children, style, grid, responsive } = options;
	const parentDataHelper = useContext( DataHelperContext );
	const RenderSocketList = useContext( SocketListContext );
	const overrides = useResponsiveOverrides( responsive );
	const computedStyle = { ...style, ...( overrides.style || {} ) };
	const computedGrid =
		grid || overrides.grid
			? { ...grid, ...( overrides.grid || {} ) }
			: null;

	// Get the array of items (rows)
	// Ensure it's an array, defaulting to empty array if null/undefined
	const items = Array.isArray( parentDataHelper.getSetting( id ) )
		? parentDataHelper.getSetting( id )
		: [];

	const addItem = () => {
		const newItem = {}; // Initialize with defaults if needed
		const newItems = [ ...items, newItem ];
		parentDataHelper.setSetting( id, newItems );
	};

	const removeItem = ( index ) => {
		const newItems = items.filter( ( _, i ) => i !== index );
		parentDataHelper.setSetting( id, newItems );
	};

	return (
		<div style={ computedStyle } className="wp-sockets-socket-wrapper">
			<BaseControl
				label={ label }
				id={ id }
				className="wp-sockets-repeater"
			>
				<div className="wp-sockets-repeater__items">
					{ items.map( ( item, index ) => (
						<RepeaterRow
							key={ index }
							item={ item }
							index={ index }
							id={ id }
							parentDataHelper={ parentDataHelper }
							computedGrid={ computedGrid }
							children={ children }
							removeItem={ removeItem }
							RenderSocketList={ RenderSocketList }
							items={ items } // Pass items array for setSetting in RepeaterRow
						/>
					) ) }
				</div>
				<Button variant="primary" onClick={ addItem }>
					Add Row
				</Button>
			</BaseControl>
		</div>
	);
};

export { RepeaterSocket };
