/**
 * WordPress dependencies.
 */
import { addFilter, removeFilter } from '@wordpress/hooks';

/**
 * Internal dependencies.
 */
import { canUseDataForms } from '../dataform/capability';

const FULL_WP = {
	components: {},
	element: {},
	data: {},
	privateApis: {},
	theme: {},
};

describe( 'canUseDataForms', () => {
	let original;

	beforeEach( () => {
		original = window.wp;
	} );

	afterEach( () => {
		window.wp = original;
		removeFilter( 'wpSockets.canUseDataForms', 'test' );
	} );

	it( 'is true when every required global is present', () => {
		window.wp = { ...FULL_WP };
		expect( canUseDataForms() ).toBe( true );
	} );

	it( 'is false on WordPress without wp.theme (6.8 and older)', () => {
		const { theme, ...withoutTheme } = FULL_WP;
		window.wp = withoutTheme;
		expect( canUseDataForms() ).toBe( false );
	} );

	it( 'is false when any other singleton is missing', () => {
		for ( const missing of Object.keys( FULL_WP ) ) {
			const wp = { ...FULL_WP };
			delete wp[ missing ];
			window.wp = wp;
			expect( canUseDataForms() ).toBe( false );
		}
	} );

	it( 'is false when wp itself is absent', () => {
		window.wp = undefined;
		expect( canUseDataForms() ).toBe( false );
	} );

	it( 'can be forced off on a supported site', () => {
		window.wp = { ...FULL_WP };
		addFilter( 'wpSockets.canUseDataForms', 'test', () => false );
		expect( canUseDataForms() ).toBe( false );
	} );

	it( 'can be forced on when detection would say no', () => {
		window.wp = {};
		addFilter( 'wpSockets.canUseDataForms', 'test', () => true );
		expect( canUseDataForms() ).toBe( true );
	} );
} );
