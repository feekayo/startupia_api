'use strict';
let express = require('express'), //require express
    config = require('./server/configure'), //configure serverr
    app = express(), //invoke express
    mongoose = require('mongoose');//require mongoose
console.log(' i work')
try {
    // console.log('I get to point 1')
    app.set('port', process.env.PORT || 3007);//set port to environment port or 3000
    app.set('views', __dirname + '/views'); //ser views directory
    config(app); //invoke app config
    mongoose.connect('mongodb://startupia:FIkk**164499@ds145312.mlab.com:45312/heroku_jrw9gf21', {db: {safe: false}}, ((err) => {
        if (err) throw err;
    })); //connect to online database
//mongoose.connect('mongodb://localhost/startupia');

    mongoose.connection.on('open', function () { //connect to mongoose
        console.log('Mongoose Connected.'); //log connection message
    });


    app.listen(app.get('port'), function () { //listen to port
        console.log(app.get('port')); //log port being listened to
    });

} catch (err) {
    console.log(err)
}
