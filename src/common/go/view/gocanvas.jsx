import './gocanvas.scss';
import React from 'react';
import {sprintf} from 'sprintf-js';
import Logger from '../../logger.js';
import GoCanvas from './gocanvas.js';
export default class GoCanvasComponent extends React.Component {
  constructor(props){
      super(props);
      this._svg = null;
      this.canvas = null;
      this.logger = new Logger("GoCanvasComponent");
      this.logger.info("constructor()");
      this.boardCanvas = null;
  }
  componentWillUnmount(){
  }

  componentDidMount(){
     this.boardCanvas = new GoCanvas('go-canvas', this.props.boardState.boardSize);
     if(this.props.onPosSelected){
        this.boardCanvas.setPointSelectedCallback(this.props.onPosSelected);
        this.boardCanvas.setCurrentPlayer(this.props.boardState.currentPlayer);
        this.boardCanvas.setMoves(this.props.boardState.moves);
      }
  }
  render() {
    if(this.boardCanvas){
      this.boardCanvas.setCurrentPlayer(this.props.boardState.currentPlayer);
      this.boardCanvas.setMoves(this.props.boardState.moves);
      this.boardCanvas.render();
    }
    return (
     <div className="go-canvas-container">
        <canvas id="go-canvas" className="go-canvas"> Your browser does not support canvas</canvas>
     </div>
    )
  }
}
