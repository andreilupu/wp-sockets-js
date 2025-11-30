/* eslint-disable no-console, @wordpress/no-unsafe-wp-apis */
import { __experimentalGrid as Grid } from '@wordpress/components';
import { useContext, useMemo } from '@wordpress/element';
import { SocketListContext } from './../../contexts';
import { useResponsiveOverrides } from './../../hooks';

const Group = ( { options } ) => {
	const { label, children, grid, responsive, itemStyle } = options;
	const RenderSocketList = useContext( SocketListContext );
	const overrides = useResponsiveOverrides( responsive );
	const computedGrid =
		grid || overrides.grid
			? { ...grid, ...( overrides.grid || {} ) }
			: null;

	const processedChildren = useMemo( () => {
		if ( ! children || ! Array.isArray( children ) ) {
			return children;
		}
		if ( ! itemStyle ) {
			return children;
		}

		return children.map( ( child ) => ( {
			...child,
			style: { ...itemStyle, ...( child.style || {} ) },
		} ) );
	}, [ children, itemStyle ] );

	if ( ! RenderSocketList ) {
		return null;
	}

	return (
		<div className="wp-sockets-group">
			{ label && <h3>{ label }</h3> }
			<div className="wp-sockets-group__content">
				{ computedGrid ? (
					<Grid
						columns={ computedGrid.columns }
						gap={ computedGrid.gap }
					>
						<RenderSocketList sockets={ processedChildren } />
					</Grid>
				) : (
					<RenderSocketList sockets={ processedChildren } />
				) }
			</div>
		</div>
	);
};

export { Group };
