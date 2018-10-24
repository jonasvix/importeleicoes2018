module.exports = {
  'secret':'secure1',
  db: {
    host: 'localhost',
    port: 27017,
    name: 'eleicoes2018test',
    turno1: 'turno1',
    turno2: 'turno2',
    options: {
      useNewUrlParser: true,

      keepAlive: true,

      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      autoIndex: false, // Don't build indexes
      reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
      reconnectInterval: 1000, // Reconnect every 1000ms
      poolSize: 10, // Maintain up to 10 socket connections
      // If not connected, return errors immediately rather than waiting for reconnect
      bufferMaxEntries: 0,
      connectTimeoutMS: 30000, // Give up initial connection after 30 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6

      user: '',
      pass: ''
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  }
};
