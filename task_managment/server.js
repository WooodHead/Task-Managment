// Require our dependencies
var express = require('express'),
  exphbs = require('express-handlebars'),
  http = require('http'),
  mongoose = require('mongoose'),
  routes = require('./server/routes'),
  passport=require('passport'),
  authRoutes = require('./server/auth');
var bodyParser = require('body-parser');
// Create an express instance and set a port variable
var app = express();
var port = process.env.PORT || 8081;

// Set handlebars as the templating engine
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Disable etag headers on responses
app.disable('etag');


// Connect to our mongo database
mongoose.connect('mongodb://localhost/task_managment');
// Set /public as our static content dir

app.use("/", express.static(__dirname + "/public/"));
app.use('/', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// pass the passport middleware
app.use(passport.initialize());
// load passport strategies
var localSignupStrategy = require('./server/passport/local-signup');
var localLoginStrategy = require('./server/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);


// Index Route

app.use(function(req,res,next){
    next();
});
var authCheckMiddleware = require('./server/middleware/auth-check');
app.use('/', authCheckMiddleware);
app.use('/auth', authRoutes);
app.use('/', routes);




// Fire this bitch up (start our server)
var server = http.createServer(app).listen(port, function() {
  console.log('Express server listening on port ' + port);
});

