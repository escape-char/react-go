import {default as Point} from './gopoint.js';
import {PointConstants,
        BoardConstants} from '../../constants.js'

export default class GoBoard{
    constructor(moves,size){
        if(!this._checkSize(size)){
            throw "Invalid Board Size Provided. Valid board sizes are 9, 13, and 19";
            return;
        }
        this.size = size;
        this.moves = moves;
        this._build();
    }
    _checkSize(size){
        return BoardConstants.SUPPORTED_SIZES.indexOf(size) !== -1;
    }
    static checkMove(m, size){
        if((!m instanceof Point)){
            console.log("invalid move provided");
            return false;
        }
        if((m.x < 0 || m.y < 0) ||
            (m.x >= size || m.y >= size)){
            console.log("outside of boundaries");
            return false;
        }
        if(PointConstants.VALID_STATES.indexOf(m.state) === -1){
            console.log("invalid state");
            return false;
        }
        return true;
    }
    static checkTaken(m, size, board){
      if(!GoBoard.checkMove(m, size)){
          throw "invalid move provided";
          return;
       }
      return board[m.x][m.y] !== PointConstants.STATE_VACANT;
    }
    isTaken(m){
        return GoBoard.checkTaken(m, this.size, this.board);
    }
    isValidMove(m){
        return GoBoard.checkMove(m, this.size);
    }
    _build(){
        this.board = [];
        for(let i=0; i<this.size; i+=1){
            this.board[i] = [];
            for(let j=0; j<this.size; j+=1){
                this.board[i][j] = PointConstants.STATE_VACANT;
            }
        }
        this.loadMoves(this.moves);
    }
    place(m){
        if(!GoBoard.checkMove(m, this.size)){
            throw "Invalid move provided";
            return;
        }
        else if(this.isTaken(m, this.size, this.board)){
            throw "Position is already taken";
            return;
        }
        this.moves.push(m);

        this.board[m.x][m.y]=m.state;
    }
    undo(){
        const last = this.moves.pop();
        this.board[last.x][last.y] = PointConstants.STATE_VACANT;
    }
    remove(m){
        if(!GoBoard.checkMove(m, this.size)){
            throw "Invalid move provided";
            return;
        }
        this.board[m.x][m.y] = PointConstants.STATE_VACANT;
    }

    loadMoves(m){
        this.moves=m;
        for(const m in this.moves){
            this.board(m.getPt(), m.state);
        }
    }
    reset(){
        this.moves = [];
        this._build(this.size);
    }

}
