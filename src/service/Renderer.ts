interface IDrawStyles {
    fontSizePx?: number
    fillStyle?: string | CanvasGradient | CanvasPattern
    textAlign?: CanvasTextAlign
    textBaseline?: CanvasTextBaseline
    lineWidth?: number
    strokeStyle?: string | CanvasGradient | CanvasPattern;
}

export interface ICoordinates {
    x: number
    y: number
}

const DEFAULT_STYLES: Required<IDrawStyles> = {
    fontSizePx: 10,
    fillStyle: "white",
    textAlign: 'center',  
    textBaseline: 'middle',
    lineWidth: 0,
    strokeStyle: ""
};

export default class Renderer {
    private readonly ctx: CanvasRenderingContext2D;
    private readonly height: number;
    private readonly width: number;

    public constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
    }

    public clear(): void {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    public drawimage(img: HTMLImageElement): void {
        const scale: number = Math.min(this.width / img.width, this.height / img.height);
        const newWidth: number = img.width * scale;
        const newHeight: number = img.height * scale;
        const x: number = (this.width - newWidth) / 2;
        const y: number = (this.height - newHeight) / 2;
        this.ctx.drawImage(img, x, y, newWidth, newHeight);
    }

    public drawLines(lines: ICoordinates[][], styles: IDrawStyles = {}): void {
        const s: Required<IDrawStyles> = this.applyStyles(styles);
        const startPoint: ICoordinates[] = lines[0];
        
        this.ctx.strokeStyle = s.strokeStyle;
        this.ctx.lineWidth = s.lineWidth;

        this.ctx.beginPath();
        this.ctx.moveTo(startPoint[0].x, startPoint[0].y);

        this.ctx.getImageData

        for (let line of lines) {
            this.ctx.lineTo(line[0].x, line[0].y);
            this.ctx.lineTo(line[1].x, line[1].y);
        }

        this.ctx.closePath();
        this.ctx.stroke(); 
    }

    public drawRect(x: number, y: number, width: number, height: number, styles: IDrawStyles = {}): void {
        const s: Required<IDrawStyles> = this.applyStyles(styles);
        this.ctx.fillStyle = s.fillStyle;
        this.ctx.lineWidth = s.lineWidth;
        this.ctx.strokeStyle = s.strokeStyle;
        this.ctx.fillRect(x, y, width, height);

        if (s.lineWidth) {
            this.ctx.strokeRect(x, y, width, height);
        }
    }

    public drawText(x: number, y: number, text: string, styles: IDrawStyles = {}): void {
        const s: Required<IDrawStyles> = this.applyStyles(styles);

        this.ctx.font = `${s.fontSizePx}px Arial`;
        this.ctx.fillStyle = s.fillStyle;
        
        this.ctx.textAlign = s.textAlign;     
        this.ctx.textBaseline = s.textBaseline;

        this.ctx.fillText(text, x, y);
    }

    private applyStyles(styles: IDrawStyles): Required<IDrawStyles> {
        return {...DEFAULT_STYLES, ...styles};
    }
}