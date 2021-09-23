const _size = 4;

class Data{
  constructor(){
      this.squares = [];
      this.score = 0;
      this.highestScore = 0;
      this.isEnded = false;
  }
  
  checkEnd(){
    const squares = this.prepareSquares(this.squares, false);

    for(let i=0; i<_size; i++){
      for(let j=0; j<_size; j++){
        if((i+1< _size && squares[i][j].value === squares[i+1][j].value)
          || (j+1< _size && squares[i][j].value === squares[i][j+1].value)){
            // A merge is possible
            return;
        }
      }
    }

    // If no merge is possible
    this.isEnded = true;
  }

  getData(){
    // return a clone of data
    return {
      squares : this.prepareSquares(this.squares, true),
      score : this.score,
      highestScore : this.highestScore,
      isEnded : this.isEnded
    };
  }

  getNext(){
    let emptySquare = [];

    // find empty square
    for(let i=0; i<this.squares.length; i++){
      if(this.squares[i] && this.squares[i].value == null){
        emptySquare.push(this.squares[i]);
      }
    }

    if(emptySquare.length){
      const index = Math.floor(Math.random() * Math.floor(emptySquare.length));

      // Update square
      emptySquare[index].value = 2;
    }

    if(emptySquare.length === 1){
      this.checkEnd();
    }
  }

  initialize(){
    this.squares = [];
    this.score = 0;
    this.isEnded = false;

    for(let i =0; i < _size; i++){
      for(let j = 0; j < _size; j++){
        this.squares.push({
          x:j,
          y:i,
          value: null,//i * 4 + j
          isMerged: false
        });
      }
    }

    this.getNext();

    return this.getData();
  }

  prepareSquares(squares, cloning){
    let preparedItems = [];
    for(let i = 0; i < squares.length; i++){
      let square = (cloning)?Object.assign({}, squares[i]): squares[i];
      let row = preparedItems[square.y];
      if(!row){
        preparedItems.splice(square.y, 0, []);
        row = preparedItems[square.y];
      }
      if(row){
        row.splice(square.x, 0, square);
      }
    }
    return preparedItems;
  }

  // top : true, false
  // left : false, false
  // bottom : true, true
  // right : false, true
  tryMove(isVertical, isSymetric){
    let hasUpdated = false;
    let orderedSquare = this.prepareSquares(this.squares, false);

    let currentSquare = undefined;
    for(let index1=0; index1<_size; index1++){
      let index2=0;

      //for(let j1=_size-1; j1>=0;j1--){
      for(let j1=0; j1<_size; j1++){
        index2 = (isSymetric) ? _size - 1 - j1: j1;
        currentSquare = (isVertical)? orderedSquare[index2][index1]: orderedSquare[index1][index2];

        if(currentSquare && currentSquare.value){
          currentSquare.isMerged = false;

          let squareToMove = undefined;
          let searchingSquare = undefined;
          let index3=0;

          // find the last empty or the first square with the same value
          //for(let j2=j1+1; j2<_size; j2++){
          for(let j2=j1-1; j2>=0; j2--){
            index3 = (isSymetric)? _size - 1 - j2: j2;
            searchingSquare = (isVertical)? orderedSquare[index3][index1]: orderedSquare[index1][index3];

            if(!searchingSquare.value){
              squareToMove = searchingSquare;
            }
            else if(currentSquare.value === searchingSquare.value
              && !searchingSquare.value.isMerged){
              squareToMove = searchingSquare; 
            }
            else{
              // We stop searching when we found a square with different value
              break;
            }
          }

          if(squareToMove){
            if(squareToMove.value){
              // Merge square
              currentSquare.value = null;
              squareToMove.value *= 2;
              squareToMove.isMerged = true;

              // Add value of merging to get score
              this.score += squareToMove.value;

              if (this.highestScore < this.score){
                this.highestScore = this.score;
              }
            }
            else{
              squareToMove.value = currentSquare.value;
              currentSquare.value = null;
            }
            hasUpdated = true;
          }
        }
      }
    }

    return hasUpdated;
  }
}

class LogicSingleton {
  constructor(){
    this.data = new Data();
  }
  
  initialize(){
    return this.data.initialize();
  }

  getData(){
    return this.data.getData();
  }

  tryMove(direction){
    let hasUpdated= false;
    if(direction){
      switch(direction){
        case 'top':
          hasUpdated = this.data.tryMove(true,false);
          break;
        case 'left':
          hasUpdated = this.data.tryMove(false,false);
          break;
        case 'bottom':
          hasUpdated = this.data.tryMove(true,true);
          break;
        case 'right':
          hasUpdated = this.data.tryMove(false,true);
          break;
        default:
          break;
      }
    }

    if(hasUpdated){
      this.data.getNext();
    }

    return hasUpdated;
  }
}

const Logic = new LogicSingleton();
Object.freeze(Logic);

export default Logic;