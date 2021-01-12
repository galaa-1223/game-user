
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const clients = {};
var players = {}, unmatched;
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

const addClient = socket => {
    console.log("New client connected", socket.id);
    clients[socket.id] = socket;
}

const removeClient = socket => {
    console.log("Client disconnected", socket.id);
    clients[socket.id] = socket;
}

function joinGame(socket) {
    players[socket.id] = {
        opponent: unmatched,
        socket: socket
    };

    if (unmatched) {
        players[unmatched].opponent = socket.id;
        unmatched = null;
    } else {
        unmatched = socket.id;
    }
}

function getOpponent(socket) {
    if (!players[socket.id].opponent) {
        return;
    }

    return players[players[socket.id].opponent].socket;
}


io.on('connection', (socket) => {

    let id = socket.id;

    addClient(socket);
    
    joinGame(socket);
    
    //Ursuldugch orj irvel togloomiih ehlehiig huleene

    if (getOpponent(socket)) {
        socket.emit("game.begin", {
            symbol: players[socket.id].symbol
        });
    
        getOpponent(socket).emit("game.begin", {
            symbol: players[getOpponent(socket).id].utga_shindee
        });
    }

    socket.on('disconnect', () => {
        removeClient(socket);
        if (getOpponent(socket)) {
            getOpponent(socket).emit("opponent.left");
        }
    });
});

http.listen(port, () => {
    console.log('Server started listening on *:' + port);
});