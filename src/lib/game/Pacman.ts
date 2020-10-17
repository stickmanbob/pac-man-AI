import { GameBoardItemType, KeyToGameDirection, GameDirectionMap, GameDirectionToKeys, GameDirection, pillMax, GameDirectionReverseMap } from '../Map';
import Item from './Item';
import { sampleArray } from '../../util/arrayUtil';
import aiConstants from './aiConstants';

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
   * Finds closest pellet or pill and returns its direction
   * If no pellet found, returns false
   * 
   * @method findClosestPelletDir
   * @param {Array<string>} validLookDirs //Array of directions we can search
   * @return {GameDirection}
   */

  findClosestPelletDir(validLookDirs: Array<string>) :string | false {

    // Find closest pellets/pills
    const itemsWithDistance: Array<ItemWithDistance> = this.findClosestItems(validLookDirs, [GameBoardItemType.BISCUIT, GameBoardItemType.PILL]);
    

    // Return if none found
    if (itemsWithDistance.length === 0) return false;
    
    // Otherwise, get the closest one and return its direction 
    
    itemsWithDistance.sort((a,b) => a.distance - b.distance);

    return itemsWithDistance[0].direction; 
  }

  /**
   * Find all ghosts that are close enough to be a threat. If none, return false
   * 
   * @method detectThreats
   * @param {Array<string>} validLookDirs
   * @returns {Array<ItemWithDistance> | false} // All ghosts that are imminently threatening
   */

  detectThreats(validLookDirs: Array<string>): Array<ItemWithDistance> | false{

    // Find closest ghosts, if any
    const ghostsWithDistance: Array<ItemWithDistance> = this.findClosestItems(validLookDirs, [GameBoardItemType.GHOST]);

    // If no ghosts are within evasion radius, continue as normal
    if(!ghostsWithDistance.some(ghost => ghost.distance <= aiConstants.evasionRadius)) return false;

    // Otherwise, return list of ghosts
    return ghostsWithDistance; 
    
  }

  /**
   * Find a safe direction given a list of threats and valid move directions
   * If no direction is safe, pick a random one
   * 
   * @param {Array <ItemWithDistance>} threats 
   * @param {Array<string>} validMoves 
   * @returns {string} // safe direction
   */

  getSafeDir(threats: Array<ItemWithDistance>, validMoves: Array<string>, validLookDirs: Array<string>): string {

    const currDirection = GameDirectionToKeys(this.direction);

    // Sort threats by distance
    threats.sort((threat1,threat2) => threat1.distance - threat2.distance );

    // Get a list of known safe directions (where we can see and there is no ghost)
    let safeMoves = validLookDirs.filter( dir => !threats.some(threat => threat.direction === dir));

    // If no known safe moves, consider doing a 180

    let blindDir:string = GameDirectionReverseMap[currDirection];

    if(safeMoves.length === 0 && validMoves.includes(blindDir)){
      safeMoves.push(blindDir);
    }
    
    // Try to run away from threats, starting from the closest one

    for(let i = 0; i < threats.length; i++){
      let threat = threats[i];

      let oppDir = GameDirectionReverseMap[threat.direction];
      
      if(safeMoves.includes(oppDir)){
        return oppDir;
      } else {
        return sampleArray(safeMoves); 
      }
    }

    // If no safe moves, go a random way
    return this.getDefaultDir(validMoves); 
  }

  /**
   * Find the nerest ghost and move towards it!
   * @method huntGhosts
   * @param {Array<ItemWithDistance>} threats 
   * @returns {string} //direction of ghost
   */

  huntGhosts(validLookDirs: Array<string>): string | false{

    let ghosts = this.findClosestItems(validLookDirs, [GameBoardItemType.GHOST]);

    // Only hunt ghosts that are within the configured radius
    ghosts = ghosts.filter((ghost) => ghost.distance <= aiConstants.huntRadius);

    if (ghosts.length === 0){
      return false;
    }

    ghosts.sort((a,b) => a.distance - b.distance);

    return ghosts[0].direction;
  }

 /**
 * Find a direction to move in in absence of any other stimulus
 * For now, pick a random direction and stay the course
 * 
 * @method getDefaultDir
 * @param {Array<string>} validMoves 
 * @returns {string} // direction to go
 */

  getDefaultDir(validMoves: Array<string>): string{
    let direction = GameDirectionToKeys(this.direction);

    if (validMoves.includes(direction)) {
      return GameDirectionToKeys(this.direction);
    } else {
      return sampleArray(validMoves)
    }

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

    // Get the current direction in key format and use it to get the back direction
    const currentDir: string = GameDirectionToKeys(this.direction); 
    const backDir: string = GameDirectionReverseMap[currentDir];

    // Calculate the valid move directions availible and valid look directions
    const validMoves: Array<string> = Object.keys(moves)

    // Valid directions to look are everywhere but behind PacMan
    const validLookDirs: Array<string> = validMoves.filter(dir => dir !== backDir);

    // If juiced, find prey:

    if(this.pillTimer.timer > 0){

      let ghostDir = this.huntGhosts(validLookDirs);

      if(ghostDir){
        move = { piece: moves[ghostDir], direction: GameDirectionMap[ghostDir] }
        return move; 
      }

    }
    
    // Otherwise, find any threats
    let threats = this.detectThreats(validLookDirs);

    // If any found within evasion radius, evade
    if(threats){

        // Find a direction to run
        let safeDir = this.getSafeDir(threats, validMoves, validLookDirs);
        // console.log(threats, safeDir);
        
        move = {piece: moves[safeDir], direction: GameDirectionMap[safeDir]};
        // console.log("threat", move);
        return move;
        
      
    }

    // If no threats, go towards the nearest pellet or pill
    let closestPelletDir = this.findClosestPelletDir(validLookDirs); 

    if(closestPelletDir){

      move = { piece: moves[closestPelletDir], direction: GameDirectionMap[closestPelletDir] }
      // console.log("pellet",move);
      return move; 
    }

    // If no pellets or ghosts, go to default pattern
    const nextDir = this.getDefaultDir(validMoves);

    move = {piece: moves[nextDir], direction: GameDirectionMap[nextDir] }; 
    // console.log("default",move);
    return move;

  }

  // // If there is a keyboard move, use it and clear it
    // if (this.desiredMove) {    
    //   if (moves[this.desiredMove]) {
    //     move = {piece: moves[this.desiredMove], direction: GameDirectionMap[this.desiredMove]};
    //     this.desiredMove = false;

    //     return move; 
    //   }
    // }


    // // Otherwise, continue in the last direction
    // if (!move && this.direction !== GameDirection.NONE) {
    //   const key = GameDirectionToKeys(this.direction);
    //   if (moves[key]) {
    //     move = {piece: moves[key], direction: this.direction};
    //   }
    // }

  

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