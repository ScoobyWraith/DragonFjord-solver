import Game from "./game/Game";

export default class SolutionCache {
    public static add(date: Date, game: Game): void {
        localStorage.setItem(SolutionCache.getDate(date), game.serialize());
    }
    
    public static get(date: Date): Game | null {
        const json: string | null = localStorage.getItem(SolutionCache.getDate(date));
        return json ? new Game().deserialize(json) : null;
    }

    private static getDate(date: Date): string {
        return date.toISOString().split("T")[0].split("-").slice(1).join("-");
    }
}