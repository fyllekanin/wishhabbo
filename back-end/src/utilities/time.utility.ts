export class TimeUtility {

    static getCurrent (): number {
        return new Date().getTime() / 1000;
    }
}
