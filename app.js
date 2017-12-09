var express = require('express'),
    config = require('./server/configure'),
    app = express();
    mongoose = require('mongoose');
    app.set('port',process.env.PORT||3000);
    app.set('views',__dirname+'/views');
    app = config(app);


console.log(__dirname);
mongoose.connect('mongodb://startupia:FIkk**164499@ds145312.mlab.com:45312/heroku_jrw9gf21',{db:{safe: false}});
mongoose.connect('mongodb://localhost/startupia');
mongoose.connection.on('open',function(){
   console.log('Mongoose Connected.');
});


app.listen(app.get('port'),function(){
    console.log (app.get('port'));
});
