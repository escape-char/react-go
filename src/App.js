import React, { Component } from 'react';
import logo from './logo.svg';
import GoCanvasComponent from './common/go/view/gocanvas.jsx';
import GoController from './common/go/controller/gocontroller.js';
import GoBoard from './common/go/model/goboard.js';
import GoPoint from './common/go/model/gopoint.js';
import {BoardConstants} from './common/constants.js';

import image from './images/goboard.png';
import './App.scss';

class App extends Component {
  constructor(props){
      super(props);
      this.goBoard = null; new GoBoard([], BoardConstants.SIZE_19);
      this.controller = null;new GoController(this.goBoard);
      this.state = {
        showIntro: true,
        moves: [],
        boardSize: 0,
        currentPlayer: ""
      }
      this.onPosSelected = this.onPosSelected.bind(this);
      this.onBoardSizeSelected = this.onBoardSizeSelected.bind(this);
      this.onBackClicked = this.onBackClicked.bind(this);
      this.onResetClicked = this.onResetClicked.bind(this);
  }
  ComponenDidMount(){
  }
  onPosSelected(pos){
    const pt = new GoPoint(pos, this.controller.currentPlayer);
    this.controller.makeMove(pt);
    this.setState({moves: this.goBoard.moves, currentPlayer: this.controller.currentPlayer});

  }
  onBoardSizeSelected(size){
    this.goBoard = new GoBoard([], size);
    this.controller = new GoController(this.goBoard);
    this.setState({boardSize:size, showIntro: false, currentPlayer: this.controller.currentPlayer});

  }
  onResetClicked(){
    this.controller.reset();
    this.setState({moves:this.goBoard.moves, currentPlayer: this.controller.currentPlayer});
  }
  onBackClicked(){
    this.controller.reset();
    this.setState({boardSize:0,
                moves:this.goBoard.moves,
                currentPlayer: this.controller.currentPlayer,
                showIntro:true});
  }
  render() {
    return (
      <div className="App">
      <a href="https://github.com/escape-char/react-go" target="_blank">
        <img style={{position: "absolute", top: 0,left: 0,border: 0}} src="https://camo.githubusercontent.com/c6625ac1f3ee0a12250227cf83ce904423abf351/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f677261795f3664366436642e706e67"
        alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_left_gray_6d6d6d.png"></img></a>
        {!this.state.showIntro  &&
        <header className="App-header">
          <button class="Go-back" onClick={this.onBackClicked}> Back </button>
          <button class="Go-reset" onClick={this.onResetClicked}> Reset</button>
        </header>
        }
        {this.state.showIntro &&
          <div>
           <img className="Go-logo"src={image}></img>
          <h3 class="Go-intro-title"> Choose a Board Size </h3>
          <ul className="Go-intro-list">
            <li className="Go-intro-item"
              onClick={()=>this.onBoardSizeSelected(9)}> 9x9</li>
            <li className="Go-intro-item"
             onClick={()=>this.onBoardSizeSelected(13)}> 13x13</li>
            <li className="Go-intro-item"
              onClick={()=>this.onBoardSizeSelected(19)}> 19x19</li>
          </ul>
          </div>
        }
        {!this.state.showIntro &&
	         <GoCanvasComponent onPosSelected={this.onPosSelected} boardState={this.state}> </GoCanvasComponent>
        }
      </div>
    );
  }
}

export default App;
