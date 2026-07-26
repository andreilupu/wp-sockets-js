import { Component } from '@wordpress/element';

class SocketErrorBoundary extends Component {
	constructor( props ) {
		super( props );
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch() {
		// Error logging removed for production
	}

	render() {
		if ( this.state.hasError ) {
			/*
			 * An optional replacement to render instead of the error notice.
			 * Sockets that have a working simpler rendering path can degrade to
			 * it rather than showing the user a dead panel — the `dataform`
			 * socket falls back to the standard socket renderer this way.
			 */
			if ( this.props.fallback ) {
				return this.props.fallback;
			}

			return (
				<div className="notice notice-error inline">
					<p>Something went wrong rendering this socket.</p>
				</div>
			);
		}

		return this.props.children;
	}
}

export { SocketErrorBoundary };
