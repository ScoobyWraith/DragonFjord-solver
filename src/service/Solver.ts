import type BoardElement from "./game/BoardElement";
import Game from "./game/Game";

export default class Solver {
    private readonly date: Date;

    public constructor(date: Date) {
        this.date = date;
    }

    public solve(): Game {
        const game: Game = new Game();
        game.board.setDatePoints(this.date);

        if (!this.isSolutionFound(game)) {
            console.error(`Can't find solution!`);
        }

        return game;
    }

    private isSolutionFound(game: Game, elementIndex: number = 0): boolean {
        const {board, elements} = game;
        const element: BoardElement = elements[elementIndex];

        for (let i = 0; i < 4; i++) {
            element.rotate();

            for (let x = 0; x < board.getWidth(); x++) {
                for (let y = 0; y < board.getHeight(); y++) {
                    element.setPosition(x, y);

                    if (board.canMerge(element)) {
                        if (elementIndex == elements.length - 1) {
                            return true;
                        }

                        board.merge(element);

                        if (this.isSolutionFound(game, elementIndex + 1)) {
                            return true;
                        } else {
                            board.unmerge(element);
                        }
                    }
                }
            }
        }

        return false;
    }
}