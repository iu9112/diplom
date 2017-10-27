module.exports = function (server) {
	let io = require("socket.io").listen(server);
	let kitchen = io.of("/kitchen");
	let client = io.of("/client");
	client.on("connection", function (socket) {
		socket.on("newConnect", function (data) {
			socket.join(data.clientID);
		});
	});
	return {kitchen, client};
}