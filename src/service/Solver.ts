import type BoardElement from "./game/BoardElement";
import Game from "./game/Game";
import SolutionCache from "./SolutionCache";

export default class Solver {
    private readonly date: Date;

    public constructor(date: Date) {
        this.date = date;
    }

    public solve(): Game | undefined {
        if (this.date.toISOString().split("T")[0] == "1995-04-20") {
            return undefined;
        }

        const cache: Game | null = SolutionCache.get(this.date);

        if (cache) {
            return cache;
        }

        const game: Game = new Game();
        game.board.setDatePoints(this.date);

        if (!this.isSolutionFound(game)) {
            console.error(`Can't find solution!`);
            return undefined;
        }

        SolutionCache.add(this.date, game);
        return game;
    }

    private isSolutionFound(game: Game, elementIndex: number = 0): boolean {
        const {board, elements} = game;
        const element: BoardElement = elements[elementIndex];

        for (let flip = 0; flip < 2; flip++) {
            element.flip();

            for (let rotate = 0; rotate < 4; rotate++) {
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
        }

        return false;
    }
}