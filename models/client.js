'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clientSchema = Schema({
    email: String,
    name: String,
    balance: Number
},{collection: 'client'});

var Client = mongoose.model('client', clientSchema);

module.exports = Client;