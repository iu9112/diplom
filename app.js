const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose');
const clientRoute = require("./server/client"); 
const order = require("./server/order");
const dish = require("./server/dish");

process.env.PWD = process.cwd()

const url = process.env.MONGODB_URI || 'mongodb://localhost/drone-cafe1';

app.set('port', process.env.PORT || '3000');

const server = app.listen(app.get('port'), function () {
    console.log('Express started on port http://localhost:' + app.get('port'));
});

mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("we're connected!");
});

let socket = require('./socket')(server);

var menu = require("./menu");
var Dish = require("./models/dish");

Dish
	.find({})
	.exec()
    .then(function (findDishes) {
		if (!findDishes.length) {
			menu.reduce(function(previous, current) {
				let newDish = new Dish({
					"title": current.title,
					"price": current.price
				});
				newDish.save(error => {
					if (error) 
						console.log(error);
				})
			}, 0);

		}
    })
	.catch(error => {
		if (error) 
			console.log(error);
	});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": true}));

app.use(express.static('./public'));

app.use('/server', clientRoute);
app.use('/server', dish);
order(app, socket);

app.use(function(req, res){
	res.status(404).send('404 Not Found');
});
app.use(function(err, req, res, next){
	console.dir(err);
	res.status(500).send('500 Server Error');
});