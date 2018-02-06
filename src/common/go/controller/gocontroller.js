import GoBoard from '../model/goboard.js';
import GoPoint from '../model/gopoint.js';
import {BoardConstants,
        PointConstants,
         PlayerConstants} from '../../constants.js'

export default class GoController{
    constructor(goBoard){
      if(goBoard && !(goBoard instanceof GoBoard)){
        throw new Error("goBoard must be instance of Go Board");
      }
      this.goBoard = goBoard || new GoBoard([], BoardConstants.SIZE_19);

      this.currentPlayer = PlayerConstants.PLAYER_BLACK;

    }
    _togglePlayer(){
      if(this.currentPlayer === PlayerConstants.PLAYER_BLACK){
        this.currentPlayer = PlayerConstants.PLAYER_WHITE;
      }else{
        this.currentPlayer = PlayerConstants.PLAYER_BLACK;
      }

    }
    makeMove(pos){
      if(!pos instanceof GoPoint){
        throw new Error("position must be instance of GoPoint");
      }
      console.log("makeMove()");
      pos.color = this.currentPlayer;
      if(this.goBoard.isTaken(pos)){
        return;
      }
      this.goBoard.place(pos);
      this._togglePlayer();
    }
    reset(){
      this.goBoard.reset();
      this.currentPlayer = PlayerConstants.PLAYER_BLACK;
    }



}
