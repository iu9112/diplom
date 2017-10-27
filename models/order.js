'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = Schema({
    client: {
		type: Schema.Types.ObjectId,
        ref: 'client'
	},
    dish: {
		type: Schema.Types.ObjectId,
        ref: 'dish'
	},
    status: {
		type: String, 
		enum: ['Заказано', 'Готовится', 'Доставляется', 'Возникли сложности', 'Подано'],
		default: 'Заказано'
	},
	sum : {
		type: Number
	}
},{collection: 'orders'});

var Order = mongoose.model('orders', orderSchema);
module.exports = Order;