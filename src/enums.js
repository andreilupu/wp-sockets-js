/**
 * Internal dependencies.
 */

import { Group } from './components/sockets/group';
import { RepeaterSocket } from './components/sockets/repeater';
import { TextSocket } from './components/sockets/text';
import { TextareaSocket } from './components/sockets/textarea';

const SOCKET_TYPES = {
	text: TextSocket,
	textarea: TextareaSocket,
	group: Group,
	repeater: RepeaterSocket,
};

export { SOCKET_TYPES };
