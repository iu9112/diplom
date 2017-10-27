const Order = require("../models/order");
const Client = require("./clientActions");
const mydrone = require("netology-fake-drone-api");

function create(socket) {
	return function (req, res) {
		let newOrder = new Order({
			"client": req.body.client,
			"dish": req.body.dish,
		});
		newOrder
			.save()
			.then(function (newOrder) {
				return Order.populate(newOrder, 'client');
			})
			.then(function (newOrder) {
				return Order.populate(newOrder, 'dish');
			})
			.then(function (newOrder) {
				return Client.buy(newOrder.client._id, -newOrder.dish.price);
			})
			.then(function(client) {
				newOrder.client = client;;
				socket.kitchen.emit("newOrder", newOrder);
				res.json(newOrder);
			})
			.catch(error => res.status(500).send({error: error.message}));
	}
}
function list(req, res) {
	let query = req.query ? req.query : {};
	Order.find(query).populate('dish').exec()
        .then(function (findOrder) {
            if (!findOrder) {
                return res.send({
                    error: 'Order not found'
                });
            } else {
                res.json(findOrder);
            }
        })
        .catch(error => res.status(500).send({error: error.message}));
}
function deleteOne(id) {
	
}

function update(socket) {
	return function (req, res) {
		let id = req.params.id;
		let orderStatus = req.body.status;
		let query = {status: orderStatus};
		let Finished = false;
        if (orderStatus == "Подано" || orderStatus == "Возникли сложности") {
            Finished = true;
        }
			
		Order
			.findOneAndUpdate({"_id": id}, {$set: query}, {new: true}).populate('dish').exec()
			.then(function (findOrder) {
				if (!findOrder) {
					return res.send({
						error: 'Order not found'
					});
				} else {
					socket.client.to(findOrder.client).emit("ChangeOfStatus", findOrder);
					if (Finished) {
                        autoDelete(findOrder, socket);							
                    }
					res.json(findOrder);
				}
			})
			.catch(error => res.status(500).send({error: error.message}));
	}
}
function deliver(socket) {
	return function (req, res) {
		let id = req.params.id;
		Order.findOne({"_id":id}).populate('dish').populate('client').exec()
			.then(function (findOrder) {
				mydrone.deliver(findOrder.client, findOrder.dish)
					.then(function () {
						req.body.status = "Подано";
						update(socket)(req, res);
					})
					.catch(function () {
						Client.buy(findOrder.client._id, findOrder.sum)
							.then(function (client) {
								socket.client.to(findOrder.client._id).emit("ChangeOfBalance", client.balance);
								req.body.status = "Возникли сложности";
								update(socket)(req, res);
							});
					});
			})
			.catch(error => res.status(500).send({error: error.message}));
	}
}

function autoDelete(order, socket) {
    setTimeout(function () {
		Order.remove({_id: order._id}, function(err, result){
			if (!err)
				socket.client.to(order.client).emit("orderDeleted", order);				
		});
    }, 100000);
}
module.exports = {
    create,
	list,
	deleteOne,
	update,
	deliver
};