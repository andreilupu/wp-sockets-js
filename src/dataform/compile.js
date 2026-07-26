/**
 * Compile a WP Sockets socket list into a DataForms (`@wordpress/dataviews`)
 * `fields` + `form` pair.
 *
 * This is the whole translation layer between the two models, kept as a pure
 * function so it can be reasoned about and tested without a DOM:
 *
 *   sockets[]  ->  { fields[], form{} }
 *
 * Model differences worth knowing:
 *
 * - WP Sockets nests values structurally (a `group` owns `children`), while
 *   DataForms keeps a **flat** field list and expresses nesting only in the
 *   form *layout*. So groups are flattened into the field list and re-expressed
 *   as layout entries with `children`.
 * - WP Sockets identifies a control by `type` and resolves the component
 *   through a `wp.hooks` filter. DataForms identifies a *data* type and takes a
 *   custom control via `Edit`. So a socket `type` maps to either a native
 *   DataForms type (when one fits) or to a custom `Edit` component.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-dataviews/
 */

/**
 * Socket type -> native DataForms field type.
 *
 * Only types with a faithful DataForms equivalent belong here. Anything absent
 * is given a custom `Edit` by `DataFormSocket`, which delegates to the existing
 * filter registry — so a socket type never silently renders as the wrong
 * control.
 */
export const NATIVE_TYPE_MAP = {
	text: 'text',
	textarea: 'text',
	number: 'integer',
	checkbox: 'boolean',
	select: 'text',
	email: 'email',
	url: 'text',
	password: 'password',
	color: 'text',
	date: 'datetime',
	datetime: 'datetime',
	integer: 'integer',
	boolean: 'boolean',
	// Same data types as above, rendered with a different widget — see
	// NAMED_CONTROLS.
	toggle: 'boolean',
	radio: 'text',
	toggleGroup: 'text',
};

/**
 * Socket types that WP Sockets renders itself and DataForms cannot express.
 *
 * These keep their existing WP Sockets component: `repeater` has no repeatable
 * counterpart in DataViews 16, and `object` edits a nested value which the flat
 * field model does not represent.
 */
export const UNSUPPORTED_TYPES = [ 'repeater', 'object' ];

/**
 * Socket type -> named DataForms control.
 *
 * A DataForms field's `type` is its *data* type, which does not by itself pick a
 * widget: a `textarea` socket mapped to the `text` type renders as a
 * single-line input and loses its multiline editing. DataForms accepts a named
 * control in `Edit` for exactly this, so map the socket types whose widget
 * differs from the default for their data type.
 *
 * A socket may also name a control explicitly with `control`, which wins.
 */
export const NAMED_CONTROLS = {
	textarea: 'textarea',
	radio: 'radio',
	toggle: 'toggle',
	toggleGroup: 'toggleGroup',
};

/**
 * Is this socket renderable inside a DataForm at all?
 *
 * @param {Object} socket A socket config object.
 * @return {boolean} True when the socket can live inside a DataForm.
 */
export const isCompilable = ( socket ) =>
	!! socket &&
	typeof socket.id === 'string' &&
	socket.id !== '' &&
	! UNSUPPORTED_TYPES.includes( socket.type );

/**
 * Map a single socket to a DataForms field descriptor.
 *
 * `Edit` is intentionally *not* resolved here — that requires React and the
 * `wp.hooks` registry. Instead the socket type is preserved on the descriptor
 * so the caller can attach a control. Keeping this function free of React is
 * what makes the compiler testable.
 *
 * @param {Object} socket A leaf (non-group) socket config.
 * @return {Object} A DataForms field descriptor.
 */
const toField = ( socket ) => {
	const field = {
		id: socket.id,
		label: socket.label ?? socket.id,
		type: NATIVE_TYPE_MAP[ socket.type ] ?? 'text',
		// Preserved so the renderer can decide between a native control and a
		// custom `Edit`; DataForms ignores unknown keys.
		socketType: socket.type,
	};

	// A named control, so the widget matches the socket type rather than the
	// default for its data type. `DataFormSocket` leaves these alone — it only
	// attaches a filter-backed `Edit` to types it does not recognise.
	const control = socket.control ?? NAMED_CONTROLS[ socket.type ];
	if ( control ) {
		field.Edit = control;
	}

	if ( socket.description ) {
		field.description = socket.description;
	}
	if ( socket.placeholder ) {
		field.placeholder = socket.placeholder;
	}
	if ( socket.readOnly ) {
		field.readOnly = true;
	}

	// `choices` (WP Sockets) -> `elements` (DataForms). A resolver function is
	// passed through as `getElements` so options can be fetched lazily, which is
	// what dynamic sources (a remote list, a taxonomy) need.
	if ( typeof socket.choices === 'function' ) {
		field.getElements = socket.choices;
	} else if ( Array.isArray( socket.choices ) ) {
		field.elements = socket.choices.map( ( choice ) =>
			typeof choice === 'object'
				? { value: choice.value, label: choice.label ?? choice.value }
				: { value: choice, label: String( choice ) }
		);
	}

	return field;
};

/**
 * Compile a socket list into `{ fields, form }` for `<DataForm>`.
 *
 * Groups become layout entries with `children`; everything else becomes a
 * field plus a layout reference. Sockets that DataForms cannot render are
 * skipped and reported in `unsupported` so the caller can fall back to the
 * legacy renderer for exactly those.
 *
 * @param {Array}  sockets                 Socket configs (may contain `group` nodes).
 * @param {Object} [options]               Options.
 * @param {string} [options.layout]        DataForms layout type. Default 'regular'.
 * @param {string} [options.labelPosition] Label position. Default 'top'.
 * @return {{fields: Array, form: Object, unsupported: Array}} Compiled result.
 */
export const compileSockets = ( sockets, options = {} ) => {
	const { layout = 'regular', labelPosition = 'top' } = options;

	const fields = [];
	const unsupported = [];

	/**
	 * Walk a socket list, pushing fields and returning layout entries.
	 *
	 * @param {Array} list Socket configs at this level.
	 * @return {Array} Layout entries for this level.
	 */
	const walk = ( list ) => {
		if ( ! Array.isArray( list ) ) {
			return [];
		}

		return list.reduce( ( entries, socket ) => {
			if ( ! socket || typeof socket !== 'object' ) {
				return entries;
			}

			if ( socket.type === 'group' ) {
				const children = walk( socket.children );
				// A group with nothing renderable inside adds no layout noise.
				if ( children.length > 0 ) {
					entries.push( {
						id: socket.id,
						label: socket.label ?? socket.id,
						children,
					} );
				}
				return entries;
			}

			if ( ! isCompilable( socket ) ) {
				unsupported.push( socket );
				return entries;
			}

			fields.push( toField( socket ) );
			entries.push( socket.id );
			return entries;
		}, [] );
	};

	const layoutFields = walk( sockets );

	return {
		fields,
		form: {
			layout: { type: layout, labelPosition },
			fields: layoutFields,
		},
		unsupported,
	};
};
