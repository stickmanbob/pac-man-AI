# Pacman Technical Challenge - Submission by Ajay Rajamani
 
This challenge repo was forked from Equip health for their coding challenge. This is my submission.
 
The game code was implemented by them, I simply added the AI for Pac-man and the ability to auto-run 100 games in a row.
 
Below are the tasks and rules they set out:
 
### Tasks
 
- Create a way to automate Pacman's moves in `src/lib/game/Pacman.ts` such that Pacman can achieve the highest score.
- Add a button that will run 100 iterations using the new automated algorithm
- Take note of any architectural problems for further discussion
 
### Rules
 
- "Looking" is defined by examining the `this.items` elements. See `findItem` method of `src/lib/game/Item.ts` for an example
- Pacman can only look ahead and side to side (he can not look behind him).
- Pacman can not look through walls
- Do not alter the Ghosts' behavior
- Do not alter the scoring rules
- Be creative
 
I believe I succeeded on all points.
 
## Implementation
 
Because the rules prevent pac-man from knowing the full board state, I implemented a simple reactive agent to guide his moves based
on what he could see.
 
Pac-man acts thusly:
 
* If he is powered up by a pill (i.e. ghost eating mode), he will chase any nearby ghosts (range configurable)
* Otherwise, he first scans for any ghosts in line of sight. If any are found within his evasion radius (configurable), he will attempt to evade
* If no ghosts are nearby, pac-man will search out the nearest pellet or pill within LoS and move towards it. This also makes him default to following chains of pellets
* If there is nothing around that he can see, pac-man will continue a straight line course until he either sees something or hits a wall, in which case he will pick another random direction and head that way
 
Configurable values, namely the `evasionRadius` and `huntRadius` can be configured by editing values in `src/lib/game/aiConstants.ts`. This will change how pac-man reacts to ghosts.
 
## Possible improvements
 
There are a number of ways the AI could be made more effective.
 
1. Pac-man could use a local memory cache to memorize the layout of the map as he explores. This would allow him to head directly for the nearest unexplored area or known pellet location in the absence of external stimuli (pellets or ghosts) instead of picking random directions to explore as he does currently. This would make the endgame much more efficient. Additionally, caching the board layout could be used to improve evasion. Right now if pac-man is boxed in by two ghosts in line of sight, he takes random directions in hopes of finding a side path he can use to escape. Having some semblance of what the map looks like would allow the use of actual search algorithms (such as a BFS) to find a possible way out.
 I would implement such a cache as a 2d array that mirrors the actual board. Because Pac-man has no idea how large the board is, the cache would have to be dynamically sized. Every time Pac-man sees a new edge beyond the current edge of the cache, the whole cache would need to be resized to fit the new information, which could potentially be time intensive (worst case O(N*M) time and space, where N and M are the actual length and width of the board). While this will not likely be a problem for a regulation board, hypothetical boards of very large size might require a different solution.
 
2. Right now Pac-man has no idea what is going on behind him. Often this leads to him evading from a ghost by running the opposite way, seeing another ghost, and turning around right into the one that was tailing him to begin with. One way to address this would be to have a `isTailed` flag set up to remember not to turn around if he has evaded 180 degrees from a ghost and there is a good chance he is being tailed. It might also be worth exploring having Pac-man periodically do a double take (quickly switch directions and then resume his original course) when not being tailed to keep some situational awareness of the flank. However, I am not sure how quickly Pac-man would be able to execute this in game time and if it would lead to a noticeable improvement in performance. Perhaps in concert with the local memory cache detailed above this would be a more advantageous move.

