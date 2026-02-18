export default class ColorUtils {
    public static generateContrastColors(n: number): string[] {
        const colors: string[] = [];

        const baseHues: number[] = [
            0, 30, 60, 120, 180, 210, 240, 270, 300, 330
        ];

        const saturations: number[] = [70, 85, 95];
        const lightnesses: number[] = [40, 55, 70];
        let index: number = 0;

        while (colors.length < n) {
            const hue: number = baseHues[index % baseHues.length];
            const sat: number = saturations[Math.floor(index / baseHues.length) % saturations.length];
            const lum: number = lightnesses[Math.floor(index / (baseHues.length * saturations.length)) % lightnesses.length];
            const hex: string = ColorUtils.hslToHex(hue, sat, lum);
            
            if (!ColorUtils.isTooLightOrDark(hex)) {
                colors.push(hex);
            }

            index++;
            
            if (index > 1000) {
                break;
            }
        }

        return colors.slice(0, n);
    }

        public static addAlphaToHex(hexColor: string, alphaPercent: number): string {
        let hex: string = hexColor.trim().replace(/^#/, '');

        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        } else if (hex.length === 4) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
        }

        if (hex.length === 8) {
            hex = hex.slice(0, 6);
        }

        const alphaByte = Math.round((alphaPercent / 100) * 255);
        const alphaHex = alphaByte.toString(16).padStart(2, '0').toLowerCase();

        return `#${hex}${alphaHex}`;
    }

    private static hslToHex(h: number, s: number, l: number): string {
        s /= 100;
        l /= 100;

        const k: (n: number) => number = n => (n + h / 30) % 12;
        const a: number = s * Math.min(l, 1 - l);
        const f: (n: number) => number = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

        const r: number = Math.round(f(0) * 255);
        const g: number = Math.round(f(8) * 255);
        const b: number = Math.round(f(4) * 255);

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    private static isTooLightOrDark(hex: string): boolean {
        const r: number = parseInt(hex.slice(1, 3), 16);
        const g: number = parseInt(hex.slice(3, 5), 16);
        const b: number = parseInt(hex.slice(5, 7), 16);
        const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
        return brightness < 40 || brightness > 220;
    }
}