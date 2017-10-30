module.exports = function enableAuthentication(server) {
  // enable authentication
  server.enableAuth({ datasource: 'db' });
};
