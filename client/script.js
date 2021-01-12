var myTurn = true, symbol;

function renderTurnMessage() {
    // Disable the board if it is the opponents turn
    if (!myTurn) {
        $("#messages").text("Your opponent's turn");
        $(".board button").attr("disabled", true);

      // Enable the board if it is your turn
    } else {
        $("#messages").text("Your turn.");
        $(".board button").removeAttr("disabled");
    }
    console.log('Helloooo')
}


socket.on("game.begin", function(data) {
    // The server will asign X or O to the player
    symbol = data.symbol;

    // Give X the first turn
    myTurn = symbol === "X";
    renderTurnMessage();
});

socket.on("opponent.left", function() {
    $("#messages").text("Your opponent left the game.");
    // $(".board button").attr("disabled", true);
});