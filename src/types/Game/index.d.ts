

interface GameBoardItemMove {
  piece: GameBoardPiece,
  direction?: GameDirection
}

//Used to store a tuple with an item, distance, and direction from current tile
interface ItemWithDistance {
  item: GameBoardItem,
  distance: number,
  direction: string //direction key ('up', 'down', 'left', 'right')
}

interface GameBoardPosition {
  x: number,
  y: number,
  direction?: GameDirection,
}

interface GameDirectionMap {
  up: GameDirection,
  down: GameDirection,
  left: GameDirection,
  right: GameDirection,
  none: GameDirection,
  [any: string]: GameDirection
}

interface GameDirectionReverseMap {
  up: string,
  down: string,
  left: string,
  right: string,
  none: string,
  [any: string]: string
}

interface GameBoardItemTimer {
  timer:number;
}

interface GameBoardItem {
  type: GameBoardItemType,
  setPiece?: (piece:GameBoardPiece, direction?: GameDirection) => void,
  getNextMove?: () => GameBoardItemMove | boolean,
  direction?: GameDirection | boolean,
  piece?: GameBoardPiece,
  pillTimer?: GameBoardItemTimer,
  backgroundItem?: GameBoardItem | false,
  color?: GhostColor,
  gotoTimeout?: () => void,
}

interface GameBoardPieceState {
  value: GameBoardPiece
}
  
interface GameBoardItemMoves {
  right?: GameBoardPiece,
  left?: GameBoardPiece,
  up?: GameBoardPiece,
  down?: GameBoardPiece,
  [any: string]: GameBoardPiece,
}

interface KeyToGameDirection {
  [any: string]: string,
}

interface GameDirectionToKeys {
  [any: GameDirection]: string,
}

interface GameBoardPiece {
  id: string,
  type: GameBoardPieceType,
  x: number,
  y: number,
  moves: GameBoardItemMoves,
}
  
interface GameState {
  items: GameBoardItem[][],
  layout: GameBoardPiece[][],
  GhostStore: Ghost[],
  PacmanStore: Pacman,
  GhostStartPoints: GameBoardPiece[],
  mode: GameMode,
  pillTimer: GameBoardItemTimer,
  turn: number,
  runningScore?: number,
  iteration?: number,
  iterationsLeft?: number
}


interface ReduxState {
  game: GameState;
}

interface ReduxAction {
  type: ActionTypes;
  payload?: any;
}