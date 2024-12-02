const http = require('http');
const express = require('express');
const path = require('path');
const { WebSocketServer } = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const players = new Map();
const projectiles = new Map();

let projectileId = 0;

// Middleware to serve static files from the 'public' directory
app.use(express.static('public'));

// Route for the root path
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Function to broadcast messages to all clients except the sender
function broadcast(message, exclude = null) {
	wss.clients.forEach((client) => {
		if (client !== exclude && client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify(message));
		}
	});
}

// WebSocket connection handling
wss.on('connection', (ws) => {
	const playerId = Date.now().toString();
	const playerData = {
		id: playerId,
		position: { x: 0, y: 1, z: 0 },
		rotation: { x: 0, y: 0, z: 0 },
		name: `Player${playerId.slice(-4)}`
	};

	players.set(playerId, playerData);

	// Send initial player data to the newly connected client
	ws.send(
		JSON.stringify({
			type: 'init',
			id: playerId,
			players: Array.from(players.values())
		})
	);

	// Notify other clients of the new player
	broadcast({ type: 'newPlayer', player: playerData }, ws);

	// Handle incoming messages from clients
	ws.on('message', (message) => {
		const data = JSON.parse(message);

		switch (data.type) {
			case 'move':
				playerData.position = data.position;
				playerData.rotation = data.rotation;
				broadcast({
					type: 'playerMove',
					id: playerId,
					position: data.position,
					rotation: data.rotation
				});
				break;
			case 'chat':
				broadcast({ type: 'chat', id: playerId, message: data.message });
				break;
			case 'shoot':
				const projectileId = Date.now().toString();
				const projectile = {
					id: projectileId,
					position: data.position,
					velocity: data.velocity,
					playerId: playerId
				};
				projectiles.set(projectileId, projectile);
				broadcast({ type: 'newProjectile', projectile });
				break;
		}
	});

	// Handle client disconnection
	ws.on('close', () => {
		players.delete(playerId);
		broadcast({ type: 'playerDisconnect', id: playerId });
	});
});

// Update projectiles and check for collisions every 100 ms
setInterval(() => {
	projectiles.forEach((projectile, id) => {
		projectile.position.x += projectile.velocity.x * 0.1;
		projectile.position.y += projectile.velocity.y * 0.1;
		projectile.position.z += projectile.velocity.z * 0.1;

		players.forEach((player) => {
			if (player.id !== projectile.playerId) {
				const dx = player.position.x - projectile.position.x;
				const dy = player.position.y - projectile.position.y;
				const dz = player.position.z - projectile.position.z;
				const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

				if (distance < 1) {
					const knockbackDirection = {
						x: player.position.x - projectile.position.x,
						y: player.position.y - projectile.position.y,
						z: player.position.z - projectile.position.z
					};

					// Normalize knockback direction
					const length = Math.sqrt(
						knockbackDirection.x * knockbackDirection.x +
							knockbackDirection.y * knockbackDirection.y +
							knockbackDirection.z * knockbackDirection.z
					);
					knockbackDirection.x /= length;
					knockbackDirection.y /= length;
					knockbackDirection.z /= length;

					// Send impact event and direction
					broadcast({
						type: 'hit',
						playerId: player.id,
						projectileId: id,
						knockbackDirection: knockbackDirection
					});

					projectiles.delete(id); // Deletes projectile after impact
				}
			}
		});

		// Deletes projectile if it goes off map
		if (projectile.position.y < 0) {
			projectiles.delete(id);
		}
	});
}, 100);

// Start the server
const port = process.env.PORT || 65530;
server.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
