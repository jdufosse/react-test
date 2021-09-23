import React from 'react';
import Logic from './Logic2048'
import './2048.css';

class Control extends React.Component{
    handleClick(event, component, action){
      if(Logic.tryMove(action)){
        component.props.onClick();
      }
    }

    render(){
      return(
        <div className='control'>
          <button className='control-button' onClick={(e) => {this.handleClick(e, this, 'top')}}>&#8593;</button>
          <br/>
          <button className='control-button' onClick={(e) => {this.handleClick(e, this, 'left')}}>&#8592;</button>
          <button className='control-button' onClick={(e) => {this.handleClick(e, this, 'bottom')}}>&#8595;</button>
          <button className='control-button' onClick={(e) => {this.handleClick(e, this, 'right')}}>&#8594;</button>
        </div>
      );
    }
}

class Header extends React.Component{
  handleClickNewGame(event, component){
    Logic.initialize();
    component.props.onClick();
  }

  render(){
    return(
      <div className='header'>
        <h1>2048</h1>
        <div className='header-score'>
          <span>
            Highest score : {this.props.highestScore}
          </span>
          <span>
            Score : {this.props.score}
          </span>
        </div>
        <div className='header-new-game'>
          <button className='new-game' onClick={(e)=>{this.handleClickNewGame(e, this)}}>New Game</button>
        </div>
      </div>
    );
  }
}

class Square extends React.Component{
  render(){
    return(
      <div className={(this.props.square.value)?'square tile-' + this.props.square.value : 'square'}>
        {this.props.square.value}
      </div>
    );
  }
}

class Row extends React.Component{
  render(){
    const items = this.props.squares.map((s) =>
      <Square square={s}/>
    );

    return(
      <div className='board-row'>
        {items}
      </div>
    );
  }
}

class Board extends React.Component{
  render(){
    //const squares = this.prepareItemList(this.props.squares);

    const items = this.props.squares.map((s) =>
        <Row squares={s} />
    );

    return(
      <div className='board'>
        {items}
        {this.props.isEnded &&
          <div className='board-message'>
            <p>Game Over !</p>
          </div>
        }
      </div>
    );
  }
}

class Game2048 extends React.Component{
    constructor(props) {
        super(props);
        const modele = Logic.initialize();
        this.state = {
            squares : modele.squares,
            score : modele.score,
            highestScore : modele.highestScore,
            isEnded : modele.isEnded
        };

        window.addEventListener('keydown', (e) => {this.onKeyDown(e, this)});
    }

    componentWillUnmount(){
      window.removeEventListener('keydown', (e) => {this.onKeyDown(e, this)});
    }

    handleClick(event, component){
      component.updateState();
    }

    onKeyDown(event, component){
      event.preventDefault();

      let hasUpdated = false;
      switch(event.key){
        case 'ArrowUp':
          hasUpdated = Logic.tryMove('top');
          break;
        case 'ArrowDown':
          hasUpdated = Logic.tryMove('bottom');
          break;
        case 'ArrowLeft':
          hasUpdated = Logic.tryMove('left');
          break;
        case 'ArrowRight':
          hasUpdated = Logic.tryMove('right');
          break;
          default:break;
      }

      if(hasUpdated){
        component.updateState();
      }
    }

    updateState(){
      const modele = Logic.getData();
      this.setState({
          squares : modele.squares,
          score : modele.score,
          highestScore : modele.highestScore,
          isEnded : modele.isEnded
      });
    }

    render(){
        return(
            <div className='game'>
                <Header
                  highestScore={this.state.highestScore}
                  score={this.state.score}
                  onClick={(e)=>{this.handleClick(e, this)}}/>
                <Board
                  squares={this.state.squares}
                  isEnded={this.state.isEnded}/>
                <Control onClick={(e)=>{this.handleClick(e, this)}}/>
            </div>
        );
    }
}

export default Game2048;