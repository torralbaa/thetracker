#!/usr/bin/node

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io-client");
const helmet = require("helmet");
const compression = require("compression");
const PlayFab = require("./node_modules/playfab-sdk/Scripts/PlayFab/PlayFab.js");
const PlayFabClientSDK = require("./node_modules/playfab-sdk/Scripts/PlayFab/PlayFabClient.js");

var playerid;
var sessionticket
var username;
var players = new Map();
let i = 0;
let j = 0;

const PORT = process.env.PORT || 80;
const EMAIL = process.argv[2] || process.env.EMAIL || "my@email.com";
const PASSWORD = process.argv[3] || process.env.PASSWORD || "mypass";

class player
{
	constructor(data)
	{
		this.username = data.username;
		this.playerid = data.playerid;
	}
}

var roomids = ["tavern", "crash_site", "port", "cellar"];

function sleep(ms)
{
	let start = new Date().getTime(); 
	while (true)
	{
		let time = new Date().getTime() - start; 
		if (time > ms)
		{
			break; 
		}
	}
}

function async_sleep(ms)
{
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function update()
{
	while(true)
	{
		if (j > 1)
		{
			j = 0;
		}
		socket.emit("joinRoom", roomids[j]);
		j++;
		await async_sleep(60000);
	}
}

app.use(compression());
app.use(helmet());

PlayFab.settings.titleId = "5417";

socket = io("https://play.boxcritters.com", {
	transports: ["websocket"]
});

socket.open();

socket.on("login", function (data) {
	console.log("Logged in.");
	if (data.error)
	{
		console.log("Error.");
	}
});

socket.on("joinRoom", function(data) {
	socket.emit("click", {
		x: 100,
		y: 200
	});
	while (i < data.PlayerCrumbs.length)
	{
		players.set(data.PlayerCrumbs[i].i, {"username": data.PlayerCrumbs[i].n, "playerid": data.PlayerCrumbs[i].i});
		i++;
	}
	i = 0;
});

socket.on("disconnect", function () {
	console.log("Disconnected.");
	socket.close();
});

socket.on("A", function(data) {
	players.set(data.i, new player({"username": data.n, "playerid": data.i}));
});

socket.on("R", function(data) {
	players.delete(data.i);
});

PlayFabClientSDK.LoginWithEmailAddress({TitleId: "5417", Email: EMAIL, Password: PASSWORD}, function (error, data) {
	if (error)
	{
		console.error(error);
	} else if (data)
	{
		playerid = data.data.PlayFabId;
		sessionticket = data.data.SessionTicket;
		PlayFabClientSDK.GetAccountInfo({TitleId: "5417", Email: EMAIL}, function (error, data) {
			username = data.data.AccountInfo.TitleInfo.DisplayName;
			socket.emit("login", {
				"ticket": sessionticket
			});
			players.set(playerid, new player({"username": username, "playerid": playerid}));
			main();
		});
	}
});

function main()
{
	sleep(5000);

	socket.emit("joinRoom", "tavern");

	sleep(5000);

	socket.emit("click", {
		x: 100,
		y: 200
	});
}

async function serve()
{
	app.get("/", function (req, res) {
		res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
		if (req.query.id != null)
		{
			players.forEach(function (value, key, map) {
				if (value.playerid == req.query.id)
				{
					return res.end("<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg height=\"256\" width=\"512\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\"><defs><style type=\"text/css\">@import url(\"https://fonts.googleapis.com/css?family=Luckiest+Guy\");.is{font-family:\"Luckiest Guy\";font-size:150%;}.off{font-family:\"Luckiest Guy\";font-size:100%;fill:#dd0000;}.on{font-family:\"Luckiest Guy\";font-size:100%;fill:#007700;}</style></defs><text x=\"10%\" y=\"10%\" class=\"is\">" + value.username + " is: <tspan class=\"on\">Online</tspan></text></svg>");
				}
			});
			return res.send("<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg height=\"256\" width=\"512\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\"><defs><style type=\"text/css\">@import url(\"https://fonts.googleapis.com/css?family=Luckiest+Guy\");.is{font-family:\"Luckiest Guy\";font-size:150%;}.off{font-family:\"Luckiest Guy\";font-size:100%;fill:#dd0000;}.on{font-family:\"Luckiest Guy\";font-size:100%;fill:#007700;}</style></defs><text x=\"10%\" y=\"10%\" class=\"is\">" + value.username + " is: <tspan class=\"off\">Offline</tspan></text></svg>");
		} else if (req.query.name != null)
		{
			players.forEach(function (value, key, map) {
				if (value.username == req.query.name)
				{
					return res.end("<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg height=\"256\" width=\"512\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\"><defs><style type=\"text/css\">@import url(\"https://fonts.googleapis.com/css?family=Luckiest+Guy\");.is{font-family:\"Luckiest Guy\";font-size:150%;}.off{font-family:\"Luckiest Guy\";font-size:100%;fill:#dd0000;}.on{font-family:\"Luckiest Guy\";font-size:100%;fill:#007700;}</style></defs><text x=\"10%\" y=\"10%\" class=\"is\">" + req.query.name + " is: <tspan class=\"on\">Online</tspan></text></svg>");
				}
			});
			return res.end("<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg height=\"256\" width=\"512\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\"><defs><style type=\"text/css\">@import url(\"https://fonts.googleapis.com/css?family=Luckiest+Guy\");.is{font-family:\"Luckiest Guy\";font-size:150%;}.off{font-family:\"Luckiest Guy\";font-size:100%;fill:#dd0000;}.on{font-family:\"Luckiest Guy\";font-size:100%;fill:#007700;}</style></defs><text x=\"10%\" y=\"10%\" class=\"is\">" + req.query.name + " is: <tspan class=\"off\">Offline</tspan></text></svg>");
		} else
		{
			return res.status(404).end("<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg height=\"256\" width=\"640\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\"><defs><style type=\"text/css\">@import url(\"https://fonts.googleapis.com/css?family=Luckiest+Guy\");.is{font-family:\"Luckiest Guy\";font-size:100%;fill:#000000;}.broken{font-family:\"Luckiest Guy\";font-size:150%;fill:#ee8800;}</style></defs><text x=\"10%\" y=\"10%\" class=\"broken\">Error: <tspan class=\"is\">Please specify a playerId or nickname.</tspan></text></svg>");
		}
	});

	http.listen(PORT, function () {
		console.log("Sever listening on http://localhost:80.");
	});
}

serve();
update();
