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
   * Finds closest dot or power pellet and returns its direction
   * 
   * @method getClosestPellet
   * @return {GameDirection}
   */

  getClosestPellet(validLookDirs: Array<Key>) :GameDirection{
    
    validLookDirs.forEach((dir: Key) => {

      this.findItemWithDistance(dir,GameBoardItemType.BISCUIT)
    })

    return false;
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
    const currentDir: Key = GameDirectionToKeys(this.direction); 
    const backDir: Key = GameDirectionReverseMap[currentDir];

    // Calculate the valid move directions availible and valid look directions
    const validMoves: Array<Key> = Object.keys(moves)

    // Valid directions to look are everywhere but behind PacMan
    const validLookDirs: Array<Key> = validMoves.filter(dir => dir !== backDir);
    
    //Testing
    // console.log(`direction: ${this.direction} backDir: ${backDir} validLookDirs: ${validLookDirs}`); 

    // Find closest dot and go for it

    

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