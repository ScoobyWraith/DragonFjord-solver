import type IJsonSerializable from "../IJsonSerializable";
import Board from "./Board";
import BoardElement from "./BoardElement"

export default class Game implements IJsonSerializable<Game> {
    public board: Board = new Board();
    public elements: BoardElement[] = [];
    
    public constructor(createEmpty: boolean = false) {
        if (createEmpty) {
            return;
        }

        this.board = new Board([
            ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "###"],
            ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "###"],
            [" 1 ", " 2 ", " 3 ", " 4 ", " 5 ", " 6 ", " 7 "],
            [" 8 ", " 9 ", " 10", " 11", " 12", " 13", " 14"],
            [" 15", " 16", " 17", " 18", " 19", " 20", " 21"],
            [" 22", " 23", " 24", " 25", " 26", " 27", " 28"],
            [" 29", " 30", " 31", "###", "###", "###", "###"]
        ]);

        this.elements = [
            new BoardElement(
                " #  ",
                "####"
            ),
            new BoardElement(
                "# #",
                "###"
            ),
            new BoardElement(
                "###",
                "###"
            ),
            new BoardElement(
                "   #",
                "####"
            ),
            new BoardElement(
                " ##",
                " # ",
                "## "
            ),
            new BoardElement(
                " ###",
                "##  "
            ),
            new BoardElement(
                "## ",
                "###"
            ),
            new BoardElement(
                "  #",
                "  #",
                "###"
            )
        ];
    }

    serialize(): string {
        return JSON.stringify([this.board.serialize(), this.elements.map(el => el.serialize())]);
    }

    deserialize(jsonData: string): Game {
        const [board, elements] = JSON.parse(jsonData);
        this.board.deserialize(board);
        this.elements = elements.map((el: string) => new BoardElement().deserialize(el));
        return this;
    }
}