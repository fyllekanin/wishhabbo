export class TimeUtility {

    static getCurrent (): number {
        return Math.floor(new Date().getTime() / 1000);
    }
}
