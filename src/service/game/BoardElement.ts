import FigureForm from "./FigureForm";


export default class BoardElement extends FigureForm {
    private x: number;
    private y: number;

    public constructor(...rows: string[]) {
        super(rows.map(row => row.split("")));
        this.x = 0;
        this.y = 0;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public setPosition(x: number, y: number): this {
        this.x = x;
        this.y = y;
        return this;
    }

    // clockwise 90 deg
    public rotate(): this {
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

    public toString(): string {
        return `x: ${this.x} y: ${this.y}\n` + super.toString();
    }

    public toJSON(): string {
        return this.toString();
    }
}