/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * External dependencies.
 */
import { DataForm } from '@wordpress/dataviews';

// DataViews ships its own stylesheet and WordPress does not enqueue it (core
// does not expose the package at all), so the framework has to carry it. See
// `webpack.config.js` for why this import needs help to survive bundling.
import '@wordpress/dataviews/build-style/style.css';

/**
 * WordPress dependencies.
 */
import { useContext, useMemo } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies.
 */
import {
	AppIdContext,
	DataHelperContext,
	SocketListContext,
} from './../../contexts';
import { SocketErrorBoundary } from './../SocketErrorBoundary';
import { canUseDataForms } from './../../dataform/capability';
import { compileSockets, NATIVE_TYPE_MAP } from './../../dataform/compile';

/**
 * A socket that renders its children through core's `DataForm`.
 *
 * This is the bridge between the two models. It lets a page adopt DataForms
 * incrementally — one socket at a time — instead of requiring the whole
 * framework to switch renderers:
 *
 *     {
 *         id: 'connection',
 *         type: 'dataform',
 *         label: 'Connection',
 *         layout: 'regular',        // regular | panel | card | row
 *         children: [
 *             { id: 'api_key', type: 'text', label: 'API key' },
 *             { id: 'enabled', type: 'checkbox', label: 'Enabled' },
 *         ],
 *     }
 *
 * Three properties are preserved deliberately:
 *
 * 1. **Persistence is unchanged.** `DataForm` is a controlled component, so the
 *    existing `dataHelper` stays the single owner of state — the same option /
 *    user-meta / apiFetch helpers keep working, as does the save button.
 * 2. **Custom socket types keep working.** A type without a native DataForms
 *    equivalent is rendered through the existing
 *    `{appId}Sockets.socketType{Type}` filter, wrapped as a DataForms `Edit`
 *    control. Those legacy components read and write through `dataHelper`
 *    themselves, so they need no changes.
 * 3. **Nothing is silently dropped.** Sockets DataForms cannot express
 *    (`repeater`, `object`) are rendered after the form by the normal WP Sockets
 *    renderer, so a mixed list still displays in full.
 *
 * @param {Object} props         Component props.
 * @param {Object} props.options The socket config.
 * @return {Object} The rendered element.
 */
const DataFormSocket = ( { options } ) => {
	const { children, label, layout, labelPosition } = options;
	const appId = useContext( AppIdContext );
	const dataHelper = useContext( DataHelperContext );
	const RenderSocketList = useContext( SocketListContext );

	const { fields, form, unsupported } = useMemo(
		() => compileSockets( children, { layout, labelPosition } ),
		[ children, layout, labelPosition ]
	);

	/*
	 * Attach a control to any field whose socket type has no native DataForms
	 * equivalent, delegating to the existing filter registry.
	 *
	 * The legacy component manages its own value through `dataHelper`, so the
	 * wrapper deliberately ignores DataForms' `field`/`onChange` arguments —
	 * this is an adapter, not a rewrite of every custom socket.
	 */
	const resolvedFields = useMemo(
		() =>
			fields.map( ( field ) => {
				if ( NATIVE_TYPE_MAP[ field.socketType ] ) {
					return field;
				}

				const socket = ( children || [] ).find(
					( candidate ) => candidate?.id === field.id
				);
				const type = field.socketType ?? '';
				const uppercased =
					type.charAt( 0 ).toUpperCase() + type.slice( 1 );

				return {
					...field,
					Edit: () =>
						applyFilters(
							`${ appId }Sockets.socketType${ uppercased }`,
							null,
							socket ?? { id: field.id, type }
						),
				};
			} ),
		[ fields, children, appId ]
	);

	// `DataForm` reads values by field id; project the helper's flat settings
	// into that shape.
	const data = useMemo(
		() =>
			resolvedFields.reduce( ( acc, field ) => {
				acc[ field.id ] = dataHelper?.getSetting( field.id ) ?? '';
				return acc;
			}, {} ),
		[ resolvedFields, dataHelper ]
	);

	if ( ! dataHelper ) {
		return null;
	}

	/*
	 * DataForms reports a batch of edits, which can contain more than one field
	 * (combined fields, or a layout that commits several at once).
	 *
	 * That batch must be applied as a single edit: `setSetting` spreads the
	 * settings snapshot captured during the current render, so calling it in a
	 * loop silently discards every change but the last. Prefer the batch setter
	 * and fall back to the per-setting one only for custom data helpers that do
	 * not implement it — accepting the caveat there, since a single-field batch
	 * (the common case) is unaffected.
	 */
	const onChange = ( edits ) => {
		if ( typeof dataHelper.setSettings === 'function' ) {
			dataHelper.setSettings( edits );
			return;
		}

		Object.entries( edits ).forEach( ( [ id, value ] ) => {
			dataHelper.setSetting( id, value );
		} );
	};

	/*
	 * The whole socket list rendered the ordinary way. Used on WordPress
	 * versions that cannot run DataViews, and as the error-boundary fallback so
	 * an unexpected DataForms failure degrades to a working form instead of a
	 * dead panel.
	 *
	 * This substitution is only possible because `dataform` is a presentation
	 * choice, not a data contract: its children are ordinary sockets writing to
	 * the same value namespace, so the same configuration renders either way.
	 */
	const legacy = RenderSocketList ? (
		<RenderSocketList sockets={ children } />
	) : null;

	if ( ! canUseDataForms() ) {
		return (
			<div className="wp-sockets-dataform wp-sockets-dataform--legacy">
				{ label && <h3>{ label }</h3> }
				{ legacy }
			</div>
		);
	}

	return (
		<div className="wp-sockets-dataform">
			{ label && <h3>{ label }</h3> }
			<SocketErrorBoundary fallback={ legacy }>
				<DataForm
					data={ data }
					fields={ resolvedFields }
					form={ form }
					onChange={ onChange }
				/>
			</SocketErrorBoundary>
			{ /* Sockets DataForms cannot render fall back to the legacy path. */ }
			{ unsupported.length > 0 && RenderSocketList && (
				<div className="wp-sockets-dataform__fallback">
					<RenderSocketList sockets={ unsupported } />
				</div>
			) }
		</div>
	);
};

export { DataFormSocket };
