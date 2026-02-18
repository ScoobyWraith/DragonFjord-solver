export default class FigureForm {
    protected data: boolean[][];
    protected readonly originalData: boolean[][];

    public constructor(data: string[][]) {
        this.data = data.map(row => row.map(el => !!el.match("#")));
        this.originalData = this.data.map(row => row.slice());
    }

    public getWidth(): number {
        return this.data[0].length;
    }

    public getHeight(): number {
        return this.data.length;
    }

    public isFilledPoint(x: number, y: number): boolean {
        return !!(this.data[y] && this.data[y][x]);
    }

    public clear(): this {
        this.data = this.originalData.map(row => row.slice());
        return this;
    }

    public toString(): string {
        return this.data.map(row => row.map(el => el ? "■" : "▫").join("")).join("\n");
    }

    public toJSON(): string {
        return this.toString();
    }
}