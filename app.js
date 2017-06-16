var express = require('express'),
    config = require('./server/configure'),
    app = express();
    mongoose = require('mongoose');
    app.set('port',process.env.PORT||3000);
    app.set('views',__dirname+'/views');
    app = config(app);


console.log(__dirname);
//mongoose.connect('mongodb://admin:spotpinadmin@ds139288.mlab.com:39288/heroku_9f8083p7');
mongoose.connect('mongodb://localhost/startupia');
mongoose.connection.on('open',function(){
   console.log('Mongoose Connected.');
});


app.listen(app.get('port'),function(){
    console.log (app.get('port'));
});
