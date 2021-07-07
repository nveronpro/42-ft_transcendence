"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisIoAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const redis_1 = require("redis");
const socket_io_redis_1 = require("socket.io-redis");
const pubClient = new redis_1.RedisClient({ host: 'localhost', port: 6379 });
const subClient = pubClient.duplicate();
const redisAdapter = socket_io_redis_1.createAdapter({ pubClient, subClient });
class RedisIoAdapter extends platform_socket_io_1.IoAdapter {
    createIOServer(port, options) {
        const server = super.createIOServer(port, options);
        server.adapter(redisAdapter);
        return server;
    }
}
exports.RedisIoAdapter = RedisIoAdapter;
//# sourceMappingURL=redis-io.adapter.js.map