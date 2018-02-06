import React, { Component } from 'react';
import logo from './logo.svg';
import GoCanvasComponent from './common/go/view/gocanvas.jsx';
import GoController from './common/go/controller/gocontroller.js';
import GoBoard from './common/go/model/goboard.js';
import GoPoint from './common/go/model/gopoint.js';
import {BoardConstants} from './common/constants.js';

import './App.css';

class App extends Component {
  constructor(props){
      super(props);
      this.goBoard = new GoBoard([], BoardConstants.SIZE_19);
      console.log("App.constructor()");
      console.log(this.goBoard.size);
      this.controller = new GoController(this.goBoard);
      this.state = {
        moves: this.goBoard.moves,
        currentPlayer: this.controller.currentPlayer
      }
      this.onPosSelected = this.onPosSelected.bind(this);
  }
  ComponenDidMount(){
  }
  onPosSelected(pos){
    console.log("onPosSelected()");
    const pt = new GoPoint(pos, this.controller.currentPlayer);
    console.log(pt);
    this.controller.makeMove(pt);
    this.setState({moves: this.goBoard.moves, currentPlayer: this.controller.currentPlayer});

  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
	      <GoCanvasComponent onPosSelected={this.onPosSelected} boardState={this.state}> </GoCanvasComponent>
      </div>
    );
  }
}

export default App;
