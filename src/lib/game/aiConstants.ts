import { GameBoardItemType } from "../Map";

export default {
    evasionRadius: 3, // How close (in tiles) pacman will let ghosts get before he runs 
    huntRadius: 4, // How close (in tiles) ghosts have to be for pacman to pursue them when powered up
    itemTypes: [ // What item types are in the game
        GameBoardItemType.PILL,
        GameBoardItemType.PACMAN,
        GameBoardItemType.GHOST,
        GameBoardItemType.EMPTY,
        GameBoardItemType.BISCUIT
    ],

}