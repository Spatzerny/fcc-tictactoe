/*START TREE GENERATION STUFF*/

function generateTree() {
    return branchOut(['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'], 'x');
}

function checkEnd(board){
    var l = [[0,1,2],[3,4,5],[6,7,8], //horizontals
             [0,3,6],[1,4,7],[2,5,8], //verticals
             [0,4,8],[6,4,2]]; //diagonals

    for (var i=0, e; i<l.length; i++){
        e = l[i];
        if(board[e[0]] != 'e' &&
	       board[e[0]] == board[e[1]] && 
	       board[e[1]] == board[e[2]]){
	           return [board[e[0]], l[i]];
	    }
    }

    if (board.indexOf('e') == -1 ){return ['d', null]} //draw

    return false; //nope, not end
}

function branchOut(b, c){
    var thisBranch = {
        board: b,
        char: (c == 'x') ? 'o' : 'x',
        end: checkEnd(b),
        branches: {},
        potential: 0,
        points: 0
    };

    //is this the end?
    var endpoints;
    if (thisBranch.end) {
        if (thisBranch.end[0]=='x'){
            endpoints = 10;
        } else if (thisBranch.end[0]=='o'){
            endpoints = -10;
        } else {
            endpoints = 0;
        }
        
        thisBranch.points = endpoints;
        thisBranch.potential = endpoints;
        return thisBranch;
    }

    //make branches
    for (var i=0, tempBoard; i<thisBranch.board.length; i++){
        if (thisBranch.board[i] == 'e'){
            tempBoard = thisBranch.board.slice(0);
            tempBoard[i] = thisBranch.char;
            thisBranch.branches[i] = branchOut(tempBoard, thisBranch.char);
        }
    }

    //potential (fused loops)
    //minimax points (chosing the branch)
    var possibleMovesPoints = [];
    for (var key in thisBranch.branches){
        thisBranch.potential += thisBranch.branches[key].potential;   
        possibleMovesPoints.push(thisBranch.branches[key].points);
    }
    
    if (thisBranch.char == 'x'){
        thisBranch.points = Math.max.apply(null, possibleMovesPoints);
    } else {
        thisBranch.points = Math.min.apply(null, possibleMovesPoints);
    }
    
    //points decay
    if (thisBranch.points > 0){thisBranch.points--} else 
    if (thisBranch.points < 0){thisBranch.points++}
    
    return thisBranch;
}
/*END TREE GENERATION STUFF*/


//evaluate the moves and pick a random one if multiple moves of equal value (for AI)
function pickMove(branch){
    var n = [];
    for (var key in branch.branches){
        var b = branch.branches[key];
        if (branch.char === 'o'){
            if (!n.length || n[0][0].points > b.points ||
                n[0][0].points === b.points && n[0][0].potential > b.potential){
                n = [];
                n.push([b, key]);
            } else
            if (n[0][0].points === b.points && n[0][0].potential === b.potential){
                n.push([b, key]);
            }
        } else {
            if (!n.length || n[0][0].points < b.points ||
                n[0][0].points === b.points && n[0][0].potential < b.potential){
                n = [];
                n.push([b, key]);
            } else
            if (n[0][0].points === b.points && n[0][0].potential === b.potential){
                n.push([b, key]);
            }
        }
        
    }
    
    var ans = n[Math.floor(Math.random() * n.length)][1];
    return ans;
}