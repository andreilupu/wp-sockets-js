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
 * Hook to apply responsive styles.
 *
 * @param {Object} baseStyle        The base style object.
 * @param {Object} responsiveConfig The responsive configuration object.
 * @return {Object} The computed style object.
 */
export const useResponsiveStyle = ( baseStyle = {}, responsiveConfig = {} ) => {
	const [ windowWidth, setWindowWidth ] = useState( window.innerWidth );

	useEffect( () => {
		const handleResize = () => {
			setWindowWidth( window.innerWidth );
		};

		window.addEventListener( 'resize', handleResize );
		return () => window.removeEventListener( 'resize', handleResize );
	}, [] );

	const computedStyle = useMemo( () => {
		let style = { ...baseStyle };

		if ( ! responsiveConfig ) {
			return style;
		}

		if ( windowWidth >= BREAKPOINTS.tablet && responsiveConfig.tablet ) {
			style = { ...style, ...responsiveConfig.tablet };
		}

		if ( windowWidth >= BREAKPOINTS.desktop && responsiveConfig.desktop ) {
			style = { ...style, ...responsiveConfig.desktop };
		}

		if ( windowWidth >= BREAKPOINTS.wide && responsiveConfig.wide ) {
			style = { ...style, ...responsiveConfig.wide };
		}

		return style;
	}, [ baseStyle, responsiveConfig, windowWidth ] );

	return computedStyle;
};
