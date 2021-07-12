const Router = require('express').Router();

Router.use( "/user", require(".././Api/Auth/User") );

module.exports=Router;