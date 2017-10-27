var express = require('express');
var router = express.Router();
var dish = require("./dishActions");

router
	.get("/dishes", dish.list)
	.get("/dishes/:id", dish.findOne);

module.exports = router;