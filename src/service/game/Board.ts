import type BoardElement from "./BoardElement";
import FigureForm from "./FigureForm";


export default class Board extends FigureForm {
    private readonly originalStringData: string[][];
    
    public constructor(data: string[][]) {
        super(data);
        this.originalStringData = data;
    }

    public canMerge(boardElement: BoardElement): boolean {
        const [initX, initY] = [boardElement.getX(), boardElement.getY()];
        const [width, height] = [boardElement.getWidth(), boardElement.getHeight()];

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (boardElement.isFilledPoint(x, y) && !this.isPointAvailableForMerge(x + initX, y + initY)) {
                    return false;
                }
            }
        }

        return true;
    }

    public merge(boardElement: BoardElement): this {
        const [initX, initY] = [boardElement.getX(), boardElement.getY()];
        const [width, height] = [boardElement.getWidth(), boardElement.getHeight()];

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (boardElement.isFilledPoint(x, y)) {
                    if (!this.isPointAvailableForMerge(x + initX, y + initY)) {
                        throw new Error(`Can't merge element ${boardElement} in ${x + initX} ${y + initY}`);
                    }

                    this.data[y + initY][x + initX] = true;
                }
            }
        }

        return this;
    }

    public unmerge(boardElement: BoardElement): this {
        const [initX, initY] = [boardElement.getX(), boardElement.getY()];
        const [width, height] = [boardElement.getWidth(), boardElement.getHeight()];

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (boardElement.isFilledPoint(x, y)) {
                    if (!this.isPointEmptyInOriginal(x + initX, y + initY)) {
                        throw new Error(`Can't UNmerge element ${boardElement} in ${x + initX} ${y + initY}`);
                    }

                    this.data[y + initY][x + initX] = false;
                }
            }
        }
        
        return this;
    }

    public setDatePoints(date: Date): this {
        const month: number = date.getMonth();
        const day: number = date.getDate() - 1;

        let y: number = month / 6 >> 0;
        let x: number = month % 6;

        this.data[y][x] = true;

        y = day / 7 >> 0;
        x = day % 7;

        this.data[y + 2][x] = true;

        return this;
    }

    public getTextFromCell(x: number, y: number): string {
        return this.originalStringData[y][x].match("#") ? "" : this.originalStringData[y][x].trim();
    }

    private isPointAvailableForMerge(x: number, y: number): boolean {
        return !!(this.data[y] && this.data[y][x] === false);
    }

    private isPointEmptyInOriginal(x: number, y: number): boolean {
        return !!(this.originalData[y] && this.originalData[y][x] === false);
    }
}