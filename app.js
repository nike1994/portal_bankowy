var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession=require('cookie-session');

var mongo = require("mongodb");
var mongoskin = require("mongoskin");
var dbUrl= process.env.MONGOHQ_URL || 'mongodb://localhost:27017/bank';
var db = mongoskin.db(dbUrl,{safe: true});


var routes = require('./routes/index');
var profile = require('./routes/profile');
var konto_oszczednosciowe = require("./routes/konto");
var przelewy=require('./routes/przelewy');
var rachunki = require('./routes/rachunki');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(cookieSession({secret:'XAG360PSLHN34'}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/profile', profile);
app.use('/', routes);
app.use('/konto_oszczednosciowe',konto_oszczednosciowe);
app.use('/przelewy',przelewy);
app.use('/rachunki', rachunki);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
};
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
