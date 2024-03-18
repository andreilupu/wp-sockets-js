const SocketsWpTabs = ( { sockets } ) => {
	return (
		<div>
			{ sockets.map( ( socket ) => {
				const { id, label, type } = socket;

				return <div key={ id }>{ label }</div>;
			} ) }
		</div>
	);
};
export default SocketsWpTabs;
