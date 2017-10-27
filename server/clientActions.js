const Client = require("../models/client");
function create(req, res) {
	let newClient = new Client({
        "name": req.body.name,
        "email": req.body.email,
		"balance": 100,
    });
	newClient
		.save()
		.then(function () {
            res.json(newClient);
        })
        .catch(error => res.status(500).send({error: error.message}));
}
function isEmpty(object) {
    return JSON.stringify(object) == "{}";
}
function findOne(req, res) {
	if(!isEmpty(req.query)) {
		let myQuery = {};
		if(req.query.id) 
			myQuery._id = req.query.id;
		if(req.query.email)
			myQuery.email = req.query.email;
		if(req.query.name)
			myQuery.name = req.query.name;
		if(isEmpty(myQuery)) {
			res.json({"error": "Bad request"})
		} else {
			Client
				.findOne(myQuery).exec()
				.then(function (findClient) {
					if (!findClient) {
						return res.json({"error": "Client not found"});
					} else {
						res.json(findClient);
					}
				})
			.catch(error => res.status(500).send({error: error.message}));
		}
	} else {
		res.json({"error": "Bad request"})
	}
}
function buy(id, sum) {
	return Client
		.findOneAndUpdate({"_id": id}, {$inc: {"balance": sum}}).exec()
}
function update(req, res) {
	let id = req.params.id;
	let sum = req.query.sum ? req.query.sum : +100;
	Client
		.findOneAndUpdate({"_id": id}, {$inc: {"balance": sum}}, {returnNewDocument: true}).exec()
		.then(function (findClient) {
            if (!findClient) {
                return res.send({
                    error: 'Client not found'
                });
            } else {
                res.json(findClient);
            }
        })
        .catch(error => res.status(500).send({error: error.message}));
}

module.exports = {
    create,
	findOne, 
	update,
	buy
};