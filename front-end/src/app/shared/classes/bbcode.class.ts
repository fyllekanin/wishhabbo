import { ClassHelper, primitiveOf } from '../helpers/class.helper';

export class BbcodeClass {
    @primitiveOf(Number)
    bbcodeId: number;
    @primitiveOf(String)
    name: string;
    @primitiveOf(String)
    example: string;
    @primitiveOf(String)
    pattern: string;
    @primitiveOf(String)
    replacement: string;
    @primitiveOf(String)
    editorPattern: string;
    @primitiveOf(String)
    editorReplacement: string;
    @primitiveOf(Boolean)
    isSystem: boolean;
    @primitiveOf(Number)
    createdAt: number;
    @primitiveOf(Number)
    updatedAt: number;

    constructor (source?: Partial<BbcodeClass>) {
        ClassHelper.assign(this, source);
    }
}
