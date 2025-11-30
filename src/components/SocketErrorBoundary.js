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
