/**
 * CloudNetwork class - Handles WebRTC connections using PeerJS.
 * Implements Singleton, Facade, and Observer patterns.
 */
export class CloudNetwork {
    static instance = null;

    constructor() {
        if (CloudNetwork.instance) {
            return CloudNetwork.instance;
        }

        this.peer = null;
        this.connections = new Map(); // peerId -> DataConnection
        this.isHost = false;
        
        // Observer Pattern: Simple event listeners
        this.events = {};

        CloudNetwork.instance = this;
    }

    /**
     * Singleton accessor
     */
    static getInstance() {
        if (!CloudNetwork.instance) {
            new CloudNetwork();
        }
        return CloudNetwork.instance;
    }

    /**
     * Initialize PeerJS
     * @param {string} [id=null] - Optional static ID
     * @returns {Promise<string>} - My Peer ID
     */
    init(id = null) {
        return new Promise((resolve, reject) => {
            if (this.peer) {
                return resolve(this.peer.id);
            }

            this.peer = new Peer(id, {
                debug: 2
            });

            this.peer.on('open', (newId) => {
                console.log('My peer ID is: ' + newId);
                this.emit('connectionOpen', newId);
                resolve(newId);
            });

            this.peer.on('connection', (conn) => {
                this.handleConnection(conn);
            });

            this.peer.on('error', (err) => {
                console.error('Peer error:', err);
                this.emit('error', err);
                reject(err);
            });

            this.peer.on('disconnected', () => {
                this.emit('disconnected');
            });
        });
    }

    /**
     * Observer Pattern: Event subscription
     */
    on(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    }

    /**
     * Observer Pattern: Event emission
     */
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(cb => cb(data));
        }
    }

    /**
     * Facade: Handle incoming connections (Mesh Networking logic)
     */
    handleConnection(conn) {
        conn.on('open', () => {
            console.log('Connected to:', conn.peer);
            this.connections.set(conn.peer, conn);

            // If I am host, tell the new peer about everyone else and request state sync
            if (this.isHost) {
                const peerList = Array.from(this.connections.keys());
                this.sendTo(conn.peer, {
                    type: 'MESH_INIT',
                    peers: peerList.filter(id => id !== conn.peer)
                });

                // Request initial state for the newcomer
                this.emit('stateRequest', conn.peer);
            }

            this.emit('peerChange', Array.from(this.connections.keys()));
        });

        conn.on('data', (data) => {
            console.log('Received data:', data);

            if (data.type === 'MESH_INIT') {
                // Connect to other peers in the list to complete the mesh
                data.peers.forEach(peerId => {
                    if (!this.connections.has(peerId)) {
                        this.connectToPeer(peerId);
                    }
                });
            } else {
                // Generic message event
                if (typeof data === 'object' && data !== null) {
                    data.senderPeerId = conn.peer;
                }
                this.emit('message', data);
            }
        });

        conn.on('close', () => {
            this.connections.delete(conn.peer);
            this.emit('peerChange', Array.from(this.connections.keys()));
        });
        
        conn.on('error', (err) => {
            console.error(`Connection error with ${conn.peer}:`, err);
            this.connections.delete(conn.peer);
            this.emit('peerChange', Array.from(this.connections.keys()));
        });
    }

    /**
     * Facade: Connect to a specific peer
     */
    connectToPeer(peerId) {
        if (!this.peer || this.connections.has(peerId) || peerId === this.peer.id) return;

        console.log('Connecting to existing peer:', peerId);
        const conn = this.peer.connect(peerId);
        this.handleConnection(conn);
    }

    /**
     * Facade: Send message to all connected peers
     */
    broadcast(message) {
        this.connections.forEach(conn => {
            if (conn.open) {
                conn.send(message);
            }
        });
    }

    /**
     * Facade: Send message to a specific peer
     */
    sendTo(peerId, message) {
        const conn = this.connections.get(peerId);
        if (conn && conn.open) {
            conn.send(message);
        }
    }

    /**
     * Facade: Disconnect and cleanup
     */
    disconnect() {
        if (this.peer) {
            this.connections.forEach(conn => conn.close());
            this.connections.clear();
            this.peer.destroy();
            this.peer = null;
            this.emit('peerChange', []);
        }
    }
}
