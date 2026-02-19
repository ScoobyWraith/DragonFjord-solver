import type IJsonSerializable from "../IJsonSerializable";
import FigureForm from "./FigureForm";


export default class BoardElement extends FigureForm implements IJsonSerializable<BoardElement> {
    private x: number;
    private y: number;
    private rotation: number;

    public constructor(...rows: string[]) {
        if (rows.length == 0) {
            super();
        } else {
            super(rows.map(row => row.split("")));
        }

        this.x = 0;
        this.y = 0;
        this.rotation = 0;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public getRotation(): number {
        return this.rotation;
    }

    public setPosition(x: number, y: number): this {
        this.x = x;
        this.y = y;
        return this;
    }

    // clockwise 90 deg
    public rotate(): this {
        this.rotation = (this.rotation + 1) % 4;
        const newData: boolean[][] = [];

        for (let col = 0; col < this.data[0].length; col++) {
            const newRow: boolean[] = [];

            for (let row = this.data.length - 1; row >= 0; row--) {
                newRow.push(this.data[row][col]);
            }

            newData.push(newRow);
        }

        this.data = newData;
        return this;
    }

    public flip(): this {
        this.data = this.data.map(row => row.reverse());
        return this;
    }

    public toString(): string {
        return `x: ${this.x} y: ${this.y}\n` + super.toString();
    }

    public toJSON(): string {
        return this.toString();
    }

    serialize(): string {
        return JSON.stringify([this.data, this.originalData, this.x, this.y, this.rotation]);
    }

    deserialize(jsonData: string): BoardElement {
        const [data, originalData, x, y, rotation] = JSON.parse(jsonData);

        this.data = data;
        this.originalData = originalData;
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        return this;
    }
}