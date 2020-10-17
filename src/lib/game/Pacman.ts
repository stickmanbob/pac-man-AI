import { GameBoardItemType, KeyToGameDirection, GameDirectionMap, GameDirectionToKeys, GameDirection, pillMax, GameDirectionReverseMap, GameBoardPieceType } from '../Map';
import Item from './Item';
import { sampleArray } from '../../util/arrayUtil';
import { Key } from 'react';

class Pacman extends Item implements GameBoardItem {

  type:GameBoardItemType = GameBoardItemType.PACMAN;

  desiredMove: string | false = false;

  score:number = 0;

  constructor(piece:GameBoardPiece, items:GameBoardItem[][], pillTimer:GameBoardItemTimer) {
    super(piece, items, pillTimer);

    // Bind context for callback events
    this.handleKeyPress = this.handleKeyPress.bind(this);

    // Add a listener for keypresses for this object
    window.addEventListener('keypress', this.handleKeyPress, false);

  }

  /**
   * Handle a keypress from the keyboard
   * 
   * @method handleKeyPress
   * @param {KeyboardEvent} e Input event
   */
  handleKeyPress(e: KeyboardEvent): void {

    if (KeyToGameDirection[e.key.toUpperCase()]) {
      this.desiredMove = KeyToGameDirection[e.key.toUpperCase()];
    }

  }

  /**
   * Finds closest pellet or power up and returns its direction
   * If no pellet found, returns false
   * 
   * @method findClosestPelletDir
   * @param {Array<string>} validLookDirs //Array of directions we can search
   * @return {GameDirection}
   */

  findClosestPelletDir(validLookDirs: Array<string>) :string | false {

    const itemsWithDistance: Array<ItemWithDistance> = [];
    
    validLookDirs.forEach((dir: string) => {

      let item = this.findItemWithDistance(dir,[GameBoardItemType.BISCUIT,GameBoardItemType.PILL]);

      if (item) itemsWithDistance.push(item);
    })

    if (itemsWithDistance.length === 0) return false;
    
    itemsWithDistance.reduce((prevItem,currItem) => {
      if(currItem.distance < prevItem.distance){
        return currItem;
      } else{
        return prevItem;
      }
    });

    return sampleArray(itemsWithDistance).direction; 
  }

  
  /**
   * Returns the next move from the keyboard input
   * 
   * @method getNextMove
   * @return {GameBoardItemMove | boolean} Next move
   */
  getNextMove(): GameBoardItemMove | boolean {

    const { moves } = this.piece;

    let move: GameBoardItemMove | false = false;

    // // If there is a keyboard move, use it and clear it
    // if (this.desiredMove) {    
    //   if (moves[this.desiredMove]) {
    //     move = {piece: moves[this.desiredMove], direction: GameDirectionMap[this.desiredMove]};
    //     this.desiredMove = false;
    //   }
    // }


    
    // // Otherwise, continue in the last direction
    // if (!move && this.direction !== GameDirection.NONE) {
    //   const key = GameDirectionToKeys(this.direction);
    //   if (moves[key]) {
    //     move = {piece: moves[key], direction: this.direction};
    //   }
    // }

    // Get the current direction in key format and use it to get the back direction
    const currentDir: string = GameDirectionToKeys(this.direction); 
    const backDir: string = GameDirectionReverseMap[currentDir];

    // Calculate the valid move directions availible and valid look directions
    const validMoves: Array<string> = Object.keys(moves)

    // Valid directions to look are everywhere but behind PacMan
    const validLookDirs: Array<string> = validMoves.filter(dir => dir !== backDir);
    
    //Testing
    // console.log(`direction: ${this.direction} backDir: ${backDir} validLookDirs: ${validLookDirs}`); 

    // Find closest dot and go for it

    let closestPelletDir = this.findClosestPelletDir(validLookDirs); 

    if(closestPelletDir){
      move = { piece: moves[closestPelletDir], direction: GameDirectionMap[closestPelletDir] }
      return move; 
    }

    // Random movement

    const nextMove: Key = sampleArray(validMoves);

    move = {piece: moves[nextMove], direction: GameDirectionMap[nextMove] }; 

    return move;

  }

  

  /**
   * Move Pacman and "eat" the item
   * 
   * @method move
   * @param {GameBoardPiece} piece 
   * @param {GameDirection} direction 
   */
  move(piece: GameBoardPiece, direction: GameDirection):void {

    const item = this.items[piece.y][piece.x];
    if (typeof item !== 'undefined') {
      this.score += item.type;
      switch(item.type) {
        case GameBoardItemType.PILL:
          this.pillTimer.timer = pillMax;
          break;
        case GameBoardItemType.GHOST:
          if (typeof item.gotoTimeout !== 'undefined')
            item.gotoTimeout();
          break;
        default: break;
      }
    }
    this.setBackgroundItem({ type: GameBoardItemType.EMPTY });
    this.fillBackgroundItem();

    this.setPiece(piece, direction);
    this.items[piece.y][piece.x] = this;
    
  }

}

export default Pacman;