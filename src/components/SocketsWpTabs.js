const SocketsWpTabs = ( { sockets } ) => {
	return (
		<div>
			{ sockets.map( ( socket ) => {
				const { id, label, type } = socket;

				return (
					<div key={ id } className={ 'socket-type-' + type }>
						{ label }
					</div>
				);
			} ) }
		</div>
	);
};
export {
	SocketsWpTabs
};
