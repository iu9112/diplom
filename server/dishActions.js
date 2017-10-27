const Dish = require("../models/dish");

function list(req, res) {
	let query = req.query ? req.query : {};
	Dish.find(query).exec()
        .then(function (findDishes) {
            if (!findDishes) {
                return res.send({
                    error: 'Dishes not founded'
                });
            } else {
                res.json(findDishes);
            }
        })
        .catch(error => res.status(500).send({error: error.message}));
}
function findOne(req, res) {
	if(req.params.id) {
		id = req.params.id;
		Dish.findOne({"_id":id}).exec()
			.then(function (findDish) {
				if (!findDish) {
					return res.json({"error": "Dish not found"});
				} else {
					res.json(findDish);
				}
			})
			.catch(error => res.status(500).send({error: error.message}));
	}
	else {
		res.json({"error": "Bad request"});
	}
}
module.exports = {
    list,
	findOne
};