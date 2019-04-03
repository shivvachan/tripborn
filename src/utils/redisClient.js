const redis = require('redis');
const bluebird  = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

/**
 * @namespace
 * @module Redis_client
 * @description this utils for redis client instance
 */

exports.redisConnection = function(){
    const client = redis.createClient(); // create client with defaults

    client.on("error", err => {
        console.log("app:redis-client", "Failed to connect to redis:\n%O", err);
        process.exit(1);
    });
}