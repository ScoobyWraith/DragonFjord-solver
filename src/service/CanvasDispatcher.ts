import ColorUtils from "./ColorUtils";
import Board from "./game/Board";
import BoardElement from "./game/BoardElement";
import Game from "./game/Game";
import Renderer from "./Renderer";
import Solver from "./Solver";
import {type ICoordinates} from "./Renderer";

interface IDrawBoardRequest {
    renderer: Renderer
    board: Board
    canvasSize: number
    cellSize: number
}

interface IDrawBoardElementRequest {
    renderer: Renderer
    board: Board
    boardElement: BoardElement
    color: string
    canvasSize: number
    cellSize: number
}

interface IGetCoordinatesOnCanvasForBoardCellRequest {
    canvasSize: number
    cellSize: number
    cellCoordinates: ICoordinates
    board: Board
}

const DEFAULT_BOARD_BORDER_COLOR: string = "#8b3800";
const DEFAULT_BOARD_COLOR: string = "#ffefa6";

export default class CanvasDispatcher {
    public render(container: HTMLDivElement | null, canvas: HTMLCanvasElement | null, solver: Solver): void {
        if (!container || !canvas) {
            return;
        }

        const containerSize: DOMRect = container.getBoundingClientRect();
        const canvasSize: number = Math.min(containerSize.width, containerSize.height) * 0.9;

        canvas.width = canvasSize;
        canvas.height = canvasSize;

        const context: CanvasRenderingContext2D | null = canvas.getContext("2d");

        if (!context) {
            return;
        }

        const renderer: Renderer = new Renderer(context, canvasSize, canvasSize);
        const game: Game = solver.solve();
        const board: Board = game.board;
        const elements: BoardElement[] = game.elements;
        const cellSize: number = Math.min(canvasSize / board.getWidth(), canvasSize / board.getHeight()) * 0.9;

        renderer.clear();
        this.drawBoard({ renderer, board, canvasSize, cellSize });
        const colors: string[] = ColorUtils.generateContrastColors(elements.length);
        let elementIndex: number = 0;

        for (let boardElement of elements) {
            const color: string = ColorUtils.addAlphaToHex(colors[elementIndex++], 80);
            this.drawBoardElement({ renderer, board, canvasSize, cellSize, boardElement, color});
        }
    }

    private drawBoard(request: IDrawBoardRequest): void {
        const {board, canvasSize, cellSize, renderer} = request;
        const areaWidthPx: number = cellSize * board.getWidth() * 1.1;
        const areaHeightPx: number = cellSize * board.getHeight() * 1.1;

        renderer.drawRect(canvasSize /2 - areaWidthPx / 2, canvasSize / 2 - areaHeightPx / 2, areaWidthPx, areaHeightPx, {
            fillStyle: DEFAULT_BOARD_BORDER_COLOR
        });
        
        for (let x = 0; x < board.getWidth(); x++) {
            for (let y = 0; y < board.getHeight(); y++) {
                const cs: ICoordinates = this.getCoordinatesOnCanvasForBoardCell({
                    canvasSize: canvasSize,
                    cellSize: cellSize,
                    board: board,
                    cellCoordinates: {x: x, y: y}
                });

                const text: string = board.getTextFromCell(x, y);
                let cellColor: string = text ? DEFAULT_BOARD_COLOR : DEFAULT_BOARD_BORDER_COLOR;

                renderer.drawRect(cs.x, cs.y, cellSize, cellSize, { fillStyle: cellColor });

                if (text) {
                    renderer.drawText(cs.x + cellSize / 2, cs.y + cellSize / 2, text, { 
                        fontSizePx:  cellSize * 0.4, fillStyle: DEFAULT_BOARD_BORDER_COLOR
                    });
                }
            }
        }
    }

    private drawBoardElement(request: IDrawBoardElementRequest): void {
        const {board, canvasSize, cellSize, renderer, boardElement, color} = request;
        
        for (let x = 0; x < boardElement.getWidth(); x++) {
            for (let y = 0; y < boardElement.getHeight(); y++) {
                if (!boardElement.isFilledPoint(x, y)) {
                    continue;
                }

                const cs: ICoordinates = this.getCoordinatesOnCanvasForBoardCell({
                    canvasSize: canvasSize,
                    cellSize: cellSize,
                    board: board,
                    cellCoordinates: {x: x + boardElement.getX(), y: y + boardElement.getY()}
                });

                renderer.drawRect(cs.x, cs.y, cellSize, cellSize, { fillStyle: color});
            }
        }

        this.drawElementBorder(request);
    }

    private drawElementBorder(request: IDrawBoardElementRequest): void {
        const {board, canvasSize, cellSize, renderer, boardElement} = request;
        const segments: ICoordinates[][] = [];

        for (let x = 0; x < boardElement.getWidth(); x++) {
            for (let y = 0; y < boardElement.getHeight(); y++) {
                if (!boardElement.isFilledPoint(x, y)) {
                    continue;
                }

                const cs: ICoordinates = this.getCoordinatesOnCanvasForBoardCell({
                    canvasSize: canvasSize,
                    cellSize: cellSize,
                    board: board,
                    cellCoordinates: {x: x + boardElement.getX(), y: y + boardElement.getY()}
                });

                for (let [i, j] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
                    if (!boardElement.isFilledPoint(x + i, y + j)) {
                        const x1: number = (cs.x + +(i > 0) * cellSize) >> 0;
                        const y1: number = (cs.y + +(j > 0) * cellSize) >> 0;

                        const x2: number = (cs.x + +(i > -1) * cellSize) >> 0;
                        const y2: number = (cs.y + +(j > -1) * cellSize) >> 0;

                        segments.push([{x: x1, y: y1}, {x: x2, y: y2}]);
                    }
                }
            }
        }

        if (segments.length == 0) {
            return;
        }

        const lines: ICoordinates[][] = [segments.pop() as ICoordinates[]];

        while (segments.length > 0) {
            const currentSegment: ICoordinates[] = lines[lines.length - 1];

            for (let i = 0; i < segments.length; i++) {
                const segment: ICoordinates[] = segments[i];
                let wasFound: boolean = false;

                if (Math.abs(currentSegment[1].x - segment[1].x) < 5 && Math.abs(currentSegment[1].y - segment[1].y) < 5) {
                    lines.push([{...segment[1]}, {...segment[0]}]);
                    wasFound = true;
                } else if (Math.abs(currentSegment[1].x - segment[0].x) < 5 && Math.abs(currentSegment[1].y - segment[0].y) < 5) {
                    lines.push(segment);
                    wasFound = true;
                }

                if (wasFound) {
                    segments.splice(i, 1);
                    break;
                }
            }
        }

        renderer.drawLines(lines, { lineWidth: 3, strokeStyle: "black" });
    }

    private getCoordinatesOnCanvasForBoardCell(request: IGetCoordinatesOnCanvasForBoardCellRequest): ICoordinates {
        const { board, canvasSize, cellSize, cellCoordinates } = request;
        const boardWidthPx: number = cellSize * board.getWidth();
        const boardHeightPx: number = cellSize * board.getHeight();

        const xPart: number = cellCoordinates.x / board.getWidth();
        const yPart: number = cellCoordinates.y / board.getHeight();

        return {
            x: canvasSize / 2 + (boardWidthPx * (xPart - 0.5)),
            y: canvasSize / 2 + (boardHeightPx* (yPart - 0.5))
        };
    }
}