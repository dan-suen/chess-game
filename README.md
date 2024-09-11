The chess game is hosted at [https://daniel-chess.netlify.app/](https://daniel-chess.netlify.app/).

This is a TypeScript-based chess game built using ReactJS. The game allows replicating important features such as *en passant*, castling, etc.

As this is an ongoing project, there may be unexpected bugs during play. Known bugs include:
- **Promotion**: Count the promoted piece as a taken pawn.
- **Promoted Pieces**: Promoted pieces may sometimes ignore movement rules.
- **En Passant**: Occasionally cannot be triggered.
- **Castling**: Sometimes cannot be triggered or can be repeatedly triggered.
- **Check Message**: Sometimes the check message is missing.
- **New Game Issue**: Starting a new game during Black player's turn will start the game as the Black player.


Thank you to [ZariefO](https://github.com/ZariefO) for helping to test the game!
