import { arrayOf, ClassHelper, date, dateAndTime, objectOf, primitiveOf } from "./class.helper";

class ExampleObject {}

class Example {
    @dateAndTime()
    dateAndTime: string;
    @date()
    date: string;

    @primitiveOf(String)
    stringValue: string;
    @primitiveOf(Number)
    numberValue: number;
    @primitiveOf(Boolean)
    booleanValue: boolean;

    @objectOf(ExampleObject)
    exampleObject: ExampleObject;
    @arrayOf(ExampleObject)
    exampleObjectArray: Array<ExampleObject> = [];

    constructor(source: any) {
        ClassHelper.assign(this, source);
    }

}

describe('ClassHelper', () => {

    describe('primitiveOf', () => {
        it('should set the value to a string', () => {
            // When
            const result = new Example({ stringValue: 0 });

            // Then
            expect(result.stringValue).toBeInstanceOf(String);
            expect(result.stringValue).toEqual('0');
        });
        it('should set the value to a number', () => {
            // When
            const result = new Example({ numberValue: '5' });

            // Then
            expect(result.numberValue).toBeInstanceOf(Number);
            expect(result.numberValue).toEqual(5);
        });
        it('should set the value to a boolean', () => {
            // When
            const result = new Example({ booleanValue: 1 });

            // Then
            expect(result.booleanValue).toBeInstanceOf(Boolean);
            expect(result.booleanValue).toEqual(true);
        });
    });

    it('objectOf should set the value to an instance of the given object', () => {
        // When
        const result = new Example({ exampleObject: {} });

        // Then
        expect(result.exampleObject).toBeInstanceOf(ExampleObject);
    });

    it('arrayOf should set the value to an array of instances of the given object', () => {
        // When
        const result = new Example({ exampleObjectArray: [{}] });

        // Then
        expect(result.exampleObjectArray).toBeInstanceOf(Array);
        expect(result.exampleObjectArray[0]).toBeInstanceOf(ExampleObject);
    });

    it('dateAndTime should set the value to date and time from unix timestamp', () => {
        // When
        const result = new Example({ dateAndTime: 1479942353 });

        // Then
        expect(result.dateAndTime).toMatch(/[a-zA-Z0-9]{4} [a-zA-Z]{3} [0-9]{4} - [0-9]{2}:[0-9]{2} [A-Z]{2}/);
    });

    it('date should set the value to long date from unix timestamp', () => {
        // When
        const result = new Example({ date: 1601367324 });

        // Then
        expect(result.date).toMatch(/[a-zA-Z0-9]{4} [a-zA-Z]{3} [0-9]{4}/);
    });
});
