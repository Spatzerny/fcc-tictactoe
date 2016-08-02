/* TODO
separate ai movement into a function
consider concatenating files
COMMENTS COMMENTS COMMENTS
youre declaring entire svg's every time you call makeMove()
endgame!
*/

function makeMove(id, branch){
    var oImg = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path d="M32.2 55.7c-13.1 0-23.7-10.6-23.7-23.7S19.1 8.3 32.2 8.3 55.9 18.9 55.9 32 45.2 55.7 32.2 55.7zM32.2 16.3c-8.7 0-15.7 7-15.7 15.7S23.5 47.7 32.2 47.7 47.9 40.6 47.9 32 40.8 16.3 32.2 16.3z" fill="#333"/></svg>';
    var xImg = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path d="M52.1 46.7c1.6 1.6 1.6 4.1 0 5.7 -0.8 0.8-1.8 1.2-2.8 1.2 -1 0-2.1-0.4-2.8-1.2L31.7 37.6 17.1 52.3c-0.8 0.8-1.8 1.2-2.8 1.2 -1 0-2-0.4-2.8-1.2 -1.6-1.6-1.6-4.1 0-5.6l14.7-14.7L11.4 17.3c-1.6-1.6-1.6-4.1 0-5.6 1.6-1.6 4.1-1.6 5.7 0l14.7 14.7 14.7-14.7c1.6-1.6 4.1-1.6 5.7 0 1.6 1.6 1.6 4.1 0 5.6l-14.7 14.7L52.1 46.7z" fill="#333"/></svg>';

    if (branch.char == 'x'){
        $('#'+id).html(xImg);
    } else {
        $('#'+id).html(oImg);
    }
}
/*
function drawCrossout(l) {
    var lhor = $('div').css({
        height:
        
    });
    var start, end;
    switch (l) {
        case [0,1,2]:
        case [3,4,5]:
        case [6,7,8]:
            start = l[0];
            break;
        case [0,3,6]:
        case [1,4,7]:
        case [2,5,8]:
            start = l[0];
            break;
        case [0,4,8]:
        case [6,4,2]:
    }
    
}
*/
$('document').ready(function(){
    var gameState = {
        gameReady : false,
        moveReady : false,
        player : 'x',
        tree : generateTree()
    }

    /*** PLAYER MOVE TRIGGER ***/
    $('#board').on('click', '.block', function(e){
        if (gameState.gameReady && gameState.moveReady){

            /* PLAYER TURN */
            makeMove(e.target.id, gameState.tree);
            gameState.tree = gameState.tree.branches[e.target.id];
            gameState.moveReady = false;
            

            /* AI TURN */
            setTimeout(function(){
    
                var move = pickMove(gameState.tree);
                makeMove(move, gameState.tree);
                gameState.tree = gameState.tree.branches[move];
                gameState.moveReady = true;
                
            }, 100);
        }
    });
    
    /*** PAWN CHOICE TRIGGER ***/
    $('.btn-choice').on('click', function(e){
        if (!gameState.gameReady) {
            gameState.player = e.delegateTarget.id;
            gameState.gameReady = true;
            
            /* IF PLAYER MOVES SECOND MAKE ONE MOVE */
            if (gameState.player == 'x'){
                    var move = pickMove(gameState.tree);
                    makeMove(move, gameState.tree);
                    gameState.tree = gameState.tree.branches[move];
            }
            
            gameState.moveReady = true;
        }
    });
});