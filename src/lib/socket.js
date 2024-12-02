let socket;
const RECONNECT_DELAY = 1000; // Delay before attempting to reconnect
let reconnectTimeout;

export function connect() {
	socket = new WebSocket('ws://localhost:65530'); // Adjust port as needed

	socket.onopen = () => {
		console.log('Connected to the server');
		clearReconnect(); // Clear any existing reconnection attempts
	};

	socket.onmessage = (event) => {
		const message = JSON.parse(event.data);
		handleIncomingMessage(message);
	};

	socket.onclose = () => {
		console.log('Disconnected from the server');
		attemptReconnect(); // Attempt to reconnect on close
	};

	socket.onerror = (error) => {
		console.error('WebSocket error:', error);
	};
}

function attemptReconnect() {
	console.log('Attempting to reconnect...');
	reconnectTimeout = setTimeout(() => {
		connect(); // Try to reconnect
	}, RECONNECT_DELAY);
}

function clearReconnect() {
	if (reconnectTimeout) {
		clearTimeout(reconnectTimeout);
		reconnectTimeout = null;
	}
}

function handleIncomingMessage(message) {
	switch (message.type) {
		case 'update':
			// Handle game state updates
			console.log('Game state update:', message.data);
			break;
		case 'chat':
			// Handle chat messages
			console.log('Chat message:', message.data);
			break;
		// Add more cases as needed for different message types
		default:
			console.warn('Unknown message type:', message.type);
			break;
	}
}

export function sendMessage(type, data) {
	if (socket && socket.readyState === WebSocket.OPEN) {
		socket.send(JSON.stringify({ type, ...data }));
	} else {
		console.warn('WebSocket is not open. Message not sent:', { type, ...data });
	}
}
