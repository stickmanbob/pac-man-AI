import { GameBoardItemType } from "../Map";

export default {
    evasionRadius: 5, // How close pacman will let ghosts get before he runs
    itemTypes: [
        GameBoardItemType.PILL,
        GameBoardItemType.PACMAN,
        GameBoardItemType.GHOST,
        GameBoardItemType.EMPTY,
        GameBoardItemType.BISCUIT
    ],

}