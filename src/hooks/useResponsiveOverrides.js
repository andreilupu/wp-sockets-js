/**
 * WordPress dependencies.
 */
import { useEffect, useMemo, useState } from '@wordpress/element';

/**
 * Breakpoints based on WordPress standards.
 */
const BREAKPOINTS = {
	tablet: 600,
	desktop: 782,
	wide: 960,
};

/**
 * Hook to get responsive overrides.
 *
 * @param {Object} responsiveConfig The responsive configuration object.
 * @return {Object} The accumulated overrides object.
 */
export const useResponsiveOverrides = ( responsiveConfig = {} ) => {
	const [ windowWidth, setWindowWidth ] = useState( window.innerWidth );

	useEffect( () => {
		const handleResize = () => {
			setWindowWidth( window.innerWidth );
		};

		window.addEventListener( 'resize', handleResize );
		return () => window.removeEventListener( 'resize', handleResize );
	}, [] );

	const overrides = useMemo( () => {
		let accumulated = {};

		if ( ! responsiveConfig ) {
			return accumulated;
		}

		if ( windowWidth >= BREAKPOINTS.tablet && responsiveConfig.tablet ) {
			accumulated = {
				...accumulated,
				style: {
					...( accumulated.style || {} ),
					...( responsiveConfig.tablet.style || {} ),
				},
				grid: {
					...( accumulated.grid || {} ),
					...( responsiveConfig.tablet.grid || {} ),
				},
			};
		}

		if ( windowWidth >= BREAKPOINTS.desktop && responsiveConfig.desktop ) {
			accumulated = {
				...accumulated,
				style: {
					...( accumulated.style || {} ),
					...( responsiveConfig.desktop.style || {} ),
				},
				grid: {
					...( accumulated.grid || {} ),
					...( responsiveConfig.desktop.grid || {} ),
				},
			};
		}

		if ( windowWidth >= BREAKPOINTS.wide && responsiveConfig.wide ) {
			accumulated = {
				...accumulated,
				style: {
					...( accumulated.style || {} ),
					...( responsiveConfig.wide.style || {} ),
				},
				grid: {
					...( accumulated.grid || {} ),
					...( responsiveConfig.wide.grid || {} ),
				},
			};
		}

		return accumulated;
	}, [ responsiveConfig, windowWidth ] );

	return overrides;
};
