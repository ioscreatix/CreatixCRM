'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var cookieDeMangle = require('cookie');
var app = module.exports = loopback();
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require('fs-extra');
const path = require('path');

var PassportConfigurator = require('loopback-component-passport').PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);

fs.ensureDirSync('./uploads/common');

boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

app.use('/auth/success', function(req, res, next) {
  var parsedCookies = cookieDeMangle.parse(req.headers.cookie);
  var tokenId = parsedCookies.access_token;
  var userId = parsedCookies.userId;

  if (tokenId && userId) {
    res.redirect('http://api.ioscreatix.com/#/passport/' + tokenId + '/' + userId);
    return;
  }  else {
    next();
  }
});


app.use('/stuff', function(req,res,next) {
  console.log(JSON.stringify(req.headers));
  next();
})

app.use(session({
  secret: 'REDACTED',
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

passportConfigurator.init();
// Load the provider configurations
var config = {};
try {
  config = require('../providers.json');
} catch (err) {
  console.error(err);
  console.error('Please configure your passport strategy in `providers.json`.');
  console.error('Copy `providers.json.template` to `providers.json`' +
    ' and replace the clientID/clientSecret values with your own.');
  process.exit(1);
}
// Initialize passport
// Set up related models
passportConfigurator.setupModels({
  userModel: app.models.User,
  userIdentityModel: app.models.UserIdentity,
  userCredentialModel: app.models.UserCredential,
});
// Configure passport strategies for third party auth providers
for (var s in config) {
  var c = config[s];
  c.session = c.session !== false;
  passportConfigurator.configureProvider(s, c);
}

app.use(loopback.static(path.resolve(__dirname, '../client/dist')));

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.

