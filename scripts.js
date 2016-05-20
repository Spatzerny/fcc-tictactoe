//checks if the board represents an end state (win, draw)
//return the winning character ('d' if draw) or false if its not an end 
function checkEnd(board) {
    var l = [[0,1,2],[3,4,5],[6,7,8], //horizontals
             [0,3,6],[1,4,7],[2,5,8], //verticals
             [0,4,8],[6,4,2]]; //diagonals

    //loop through 
    for (var i=0, e; i<l.length; i++) {
        e = l[i];
        if(board[e[0]] != 'e' &&
	       board[e[0]] == board[e[1]] && board[e[1]] == board[e[2]]) {
	           return board[e[0]];
	    }
    }

    if (board.indexOf('e') == -1 ) {return 'd'} //draw

    return false; //nope, not end
}

function branchOut(b, c, d) {
    var thisBranch = {
        depth: d+1,
        board: b,
        char: (c == 'x') ? 'o' : 'x',
        end: checkEnd(b),
        branches: {},
        potential: 0,
        points: 0
    };

    //is this the end?
    if (thisBranch.end=='x') {
        thisBranch.points = 10;
        thisBranch.potential = 10;
        return thisBranch;
    } else
    if (thisBranch.end=='o') {
        thisBranch.points = -10;
        thisBranch.potential = -10;
        return thisBranch;
    } else
    if (thisBranch.end=='d') {
        thisBranch.points = 0;
        thisBranch.potential = 0;
        return thisBranch;
    }

    //make branches
    for (var i=0, tempBoard; i<thisBranch.board.length; i++) {
        if (thisBranch.board[i] == 'e') {
            tempBoard = thisBranch.board.slice(0);
            tempBoard[i] = thisBranch.char;
            thisBranch.branches[i] = branchOut(tempBoard, thisBranch.char, d);
        }
    }

    //potential
    for (var key in thisBranch.branches) {
        thisBranch.potential += thisBranch.branches[key].potential;   
    }
    
    var o = [];
    for (var key in thisBranch.branches) {
        o.push(thisBranch.branches[key].points);
    }
    
    if (thisBranch.char == 'x') {
        thisBranch.points = Math.max.apply(null, o);
    } else 
    if (thisBranch.char == 'o') {
        thisBranch.points = Math.min.apply(null, o);
    }
    
    //points decay
    if (thisBranch.points > 0) {thisBranch.points--} 
    else if (thisBranch.points < 0) {thisBranch.points++}
    
    
    return thisBranch;
}

function pickMove(branch) {
    var n = [];
    for (var key in branch.branches) {
        var b = branch.branches[key];
        if (branch.char === 'o') {
            if (!n.length || n[0][0].points > b.points ||
                n[0][0].points === b.points && n[0][0].potential > b.potential) {
                n = [];
                n.push([b, key]);
            } else
            if (n[0][0].points === b.points && n[0][0].potential === b.potential) {
                n.push([b, key]);
            }
        } else {
            if (!n.length || n[0][0].points < b.points ||
                n[0][0].points === b.points && n[0][0].potential < b.potential) {
                n = [];
                n.push([b, key]);
            } else
            if (n[0][0].points === b.points && n[0][0].potential === b.potential) {
                n.push([b, key]);
            }
        }
        
    }
    console.log(n);
    //var ans n[0][1];
    var ans = n[Math.floor(Math.random() * n.length)][1];
    console.log(ans);
    return ans;
}

function makeMove(id, branch) {
    var oImg = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path d="M32 52.7c-11.4 0-20.7-9.3-20.7-20.7 0-11.4 9.3-20.7 20.7-20.7 11.4 0 20.7 9.3 20.7 20.7C52.7 43.4 43.4 52.7 32 52.7zM32 26.1c-3.2 0-5.9 2.6-5.9 5.9s2.6 5.9 5.9 5.9 5.9-2.6 5.9-5.9S35.2 26.1 32 26.1z"/></svg>'
    var xImg = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" class="undefined"><path d="M49.1 38.6c2.9 2.9 2.9 7.6 0 10.5 -1.4 1.5-3.3 2.2-5.2 2.2 -1.9 0-3.8-0.7-5.2-2.2l-6.6-6.6 -6.6 6.6c-1.4 1.5-3.3 2.2-5.2 2.2 -1.9 0-3.8-0.7-5.2-2.2 -2.9-2.9-2.9-7.6 0-10.5l6.6-6.6 -6.6-6.6c-2.9-2.9-2.9-7.6 0-10.5 2.9-2.9 7.6-2.9 10.5 0l6.6 6.6 6.6-6.6c2.9-2.9 7.6-2.9 10.5 0 2.9 2.9 2.9 7.6 0 10.5l-6.6 6.6L49.1 38.6z" class="undefined"/></svg>'

    if (branch.char == 'x') {
        $('#'+id).html(xImg);
    } else {
        $('#'+id).html(oImg);
    }
}


function debugstuff(branch) {
    console.log(branch);
    $('#hed').text(branch.char);
    $('#boardstate').text(branch.board.join('-'));
    $('.block').each(function(_,elm){
        if (branch.branches[$(elm).attr('id')]) {
            $(elm).text(branch.branches[$(elm).attr('id')].points+'\n'+branch.branches[$(elm).attr('id')].potential);
        }
    });
}

$('document').ready(function() {

    var player = 'o';
    var tree = branchOut(['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'], 'x', 0);
    
    if (player = 'o') {
    
            var move = pickMove(tree);
            makeMove(move, tree);
            tree = tree.branches[move];
    }
    
    $('#board').on('click', '.block', function(e){
        e.stopPropagation();
        
        makeMove(e.target.id, tree);
        tree = tree.branches[e.target.id];
        
       // setTimeout(function(){

            var move = pickMove(tree);
            makeMove(move, tree);
            tree = tree.branches[move];
            
       // }, 1);
    });
});