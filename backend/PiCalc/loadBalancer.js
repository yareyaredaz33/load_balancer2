class LoadBalancer {
    constructor(servers) {
        this.servers = servers;
        this.currentServerIndex = 0;
    }

    getNextServer() {
        const server = this.servers[this.currentServerIndex];
        this.currentServerIndex = (this.currentServerIndex + 1) % this.servers.length;
        return server;
    }

    handleRequest(request) {
        const server = this.getNextServer();
        console.log(`Redirecting request to server: ${server}`);
        // Here, you would typically forward the request to the selected server.
    }
}

// Example usage
const servers = ['Server1', 'Server2', 'Server3'];
const loadBalancer = new LoadBalancer(servers);

// Simulating incoming requests
for (let i = 1; i <= 10; i++) {
    loadBalancer.handleRequest(`Request ${i}`);
}
module.exports = LoadBalancer;
