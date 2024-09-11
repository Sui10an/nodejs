import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vite';

import {Server} from 'socket.io'

const webSocketServer = {
    name: 'webSocketServer',
    configureServer(server: any) {
        const io = new Server(server.httpServer)

        io.on('connection', (socket) => {
            const username = `User ${Math.round(Math.random() * 999_999)}`
            socket.emit('name', username)

            socket.on('message', (message) => {
                io.emit('message', {
                    from: username,
                    message: message,
                    time: new Date().toLocaleString(),
                })
            })
        })

        console.log('SocketIO injected');
    }
}

export default defineConfig({
    plugins: [
        sveltekit(),
        webSocketServer,
    ]
});