/**
 * WordPress dependencies.
 */
import { useEffect, useState } from '@wordpress/element';
import { doAction } from '@wordpress/hooks';

/**
 * Hook to setup the sockets for a specific app.
 *
 * @param {string} appId The app id.
 * @return {boolean} isReady Whether the sockets are ready to be rendered.
 */
const useSocketSetup = ( appId ) => {
	const [ isReady, setIsReady ] = useState( false );

	useEffect( () => {
		doAction( 'sockets.loadTypes', appId );
		setIsReady( true );
	}, [ appId ] );

	return isReady;
};

export { useSocketSetup };
