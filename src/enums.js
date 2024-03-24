/**
 * Internal dependencies.
 */
import { TextSocket, TextareaSocket } from './components/sockets';

/**
 * Config enums.
 */
const SOCKET_TYPES = {
	text: TextSocket,
	textarea: TextareaSocket,
};

export { SOCKET_TYPES };
