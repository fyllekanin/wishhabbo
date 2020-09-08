export class TimeUtility {

    static getCurrent (): number {
        return Math.floor(new Date().getTime() / 1000);
    }

    static getCurrentDay (): number {
        const day = new Date().getUTCDay();
        return day === 0 ? 7 : day;
    }
}
