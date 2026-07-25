/**
 * Internal dependencies.
 */
import {
	compileSockets,
	isCompilable,
	NATIVE_TYPE_MAP,
} from '../dataform/compile';

describe( 'compileSockets', () => {
	it( 'compiles a flat socket list into fields and a layout', () => {
		const { fields, form, unsupported } = compileSockets( [
			{ id: 'api_key', type: 'text', label: 'API key' },
			{ id: 'retries', type: 'number', label: 'Retries' },
		] );

		expect( fields ).toEqual( [
			{
				id: 'api_key',
				label: 'API key',
				type: 'text',
				socketType: 'text',
			},
			{
				id: 'retries',
				label: 'Retries',
				type: 'integer',
				socketType: 'number',
			},
		] );
		expect( form.fields ).toEqual( [ 'api_key', 'retries' ] );
		expect( form.layout ).toEqual( {
			type: 'regular',
			labelPosition: 'top',
		} );
		expect( unsupported ).toEqual( [] );
	} );

	it( 'flattens groups into fields but keeps nesting in the layout', () => {
		const { fields, form } = compileSockets( [
			{
				id: 'connection',
				type: 'group',
				label: 'Connection',
				children: [
					{ id: 'url', type: 'text', label: 'URL' },
					{ id: 'enabled', type: 'checkbox', label: 'Enabled' },
				],
			},
		] );

		// Flat field list — DataForms does not nest values.
		expect( fields.map( ( f ) => f.id ) ).toEqual( [ 'url', 'enabled' ] );
		// Nesting survives in the layout only.
		expect( form.fields ).toEqual( [
			{
				id: 'connection',
				label: 'Connection',
				children: [ 'url', 'enabled' ],
			},
		] );
	} );

	it( 'handles arbitrarily nested groups', () => {
		const { fields, form } = compileSockets( [
			{
				id: 'outer',
				type: 'group',
				children: [
					{
						id: 'inner',
						type: 'group',
						children: [ { id: 'deep', type: 'text' } ],
					},
				],
			},
		] );

		expect( fields.map( ( f ) => f.id ) ).toEqual( [ 'deep' ] );
		expect( form.fields[ 0 ].children[ 0 ].children ).toEqual( [ 'deep' ] );
	} );

	it( 'reports unsupported sockets instead of dropping them silently', () => {
		const repeater = { id: 'items', type: 'repeater', label: 'Items' };
		const { fields, form, unsupported } = compileSockets( [
			{ id: 'name', type: 'text' },
			repeater,
		] );

		expect( fields.map( ( f ) => f.id ) ).toEqual( [ 'name' ] );
		expect( form.fields ).toEqual( [ 'name' ] );
		// The caller can render these through the legacy renderer.
		expect( unsupported ).toEqual( [ repeater ] );
	} );

	it( 'omits a group whose children are all unsupported', () => {
		const { form, unsupported } = compileSockets( [
			{
				id: 'group_of_repeaters',
				type: 'group',
				children: [ { id: 'r', type: 'repeater' } ],
			},
		] );

		// No empty group heading left behind in the layout.
		expect( form.fields ).toEqual( [] );
		expect( unsupported ).toHaveLength( 1 );
	} );

	it( 'maps choices to elements, and a resolver to getElements', () => {
		const resolver = async () => [ { value: 'a', label: 'A' } ];
		const { fields } = compileSockets( [
			{
				id: 'static',
				type: 'select',
				choices: [ 'one', { value: 'two', label: 'Two' } ],
			},
			{ id: 'dynamic', type: 'select', choices: resolver },
		] );

		expect( fields[ 0 ].elements ).toEqual( [
			{ value: 'one', label: 'one' },
			{ value: 'two', label: 'Two' },
		] );
		// Lazy option lists are passed through untouched.
		expect( fields[ 1 ].getElements ).toBe( resolver );
		expect( fields[ 1 ].elements ).toBeUndefined();
	} );

	it( 'carries optional field metadata through', () => {
		const { fields } = compileSockets( [
			{
				id: 'x',
				type: 'text',
				description: 'Help text',
				placeholder: 'e.g. foo',
				readOnly: true,
			},
		] );

		expect( fields[ 0 ] ).toMatchObject( {
			description: 'Help text',
			placeholder: 'e.g. foo',
			readOnly: true,
		} );
	} );

	it( 'falls back to a text field for unknown socket types', () => {
		const { fields } = compileSockets( [
			{ id: 'custom', type: 'colorPicker', label: 'Colour' },
		] );

		// Unknown types still produce a field; the renderer attaches a custom
		// `Edit` via the existing filter registry, and `socketType` is what
		// lets it do so.
		expect( fields[ 0 ].type ).toBe( 'text' );
		expect( fields[ 0 ].socketType ).toBe( 'colorPicker' );
		expect( NATIVE_TYPE_MAP.colorPicker ).toBeUndefined();
	} );

	it( 'defaults a missing label to the socket id', () => {
		const { fields } = compileSockets( [ { id: 'no_label', type: 'text' } ] );
		expect( fields[ 0 ].label ).toBe( 'no_label' );
	} );

	it( 'honours layout options', () => {
		const { form } = compileSockets( [ { id: 'a', type: 'text' } ], {
			layout: 'panel',
			labelPosition: 'side',
		} );

		expect( form.layout ).toEqual( {
			type: 'panel',
			labelPosition: 'side',
		} );
	} );

	it( 'survives malformed input', () => {
		expect( compileSockets( undefined ).fields ).toEqual( [] );
		expect( compileSockets( [ null, 'nope', 42 ] ).fields ).toEqual( [] );
		// A socket with no usable id is not a field.
		expect( compileSockets( [ { type: 'text' } ] ).fields ).toEqual( [] );
	} );
} );

describe( 'isCompilable', () => {
	it( 'requires a non-empty id', () => {
		expect( isCompilable( { id: 'a', type: 'text' } ) ).toBe( true );
		expect( isCompilable( { id: '', type: 'text' } ) ).toBe( false );
		expect( isCompilable( { type: 'text' } ) ).toBe( false );
		expect( isCompilable( null ) ).toBe( false );
	} );

	it( 'rejects types DataForms cannot express', () => {
		expect( isCompilable( { id: 'a', type: 'repeater' } ) ).toBe( false );
		expect( isCompilable( { id: 'a', type: 'object' } ) ).toBe( false );
	} );
} );
