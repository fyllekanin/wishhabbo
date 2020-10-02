import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';
import { InternalRequest } from '../../../utilities/internal.request';
import { IEntity } from '../entity.interface';

interface IBbcode extends IEntity {
    bbcodeId: number;
    name: string;
    example: string;
    pattern: string;
    replacement: string;
    editorPattern: string;
    editorReplacement: string;
    isSystem: boolean;
}

@Entity('bbcodes')
export class BbcodeEntity extends CreatedUpdatedAtEntity implements IBbcode {
    @PrimaryGeneratedColumn()
    bbcodeId: number;
    @Column({ unique: true })
    name: string;
    @Column({ unique: true })
    example: string;
    @Column({ unique: true })
    pattern: string;
    @Column({ unique: true })
    replacement: string;
    @Column({ unique: true, nullable: true })
    editorPattern: string;
    @Column({ unique: true, nullable: true })
    editorReplacement: string;
    @Column()
    @Index()
    isSystem: boolean;

    constructor (builder?: IBbcode) {
        super();
        if (!builder) {
            return;
        }

        this.bbcodeId = builder.bbcodeId;
        this.name = builder.name;
        this.example = builder.example;
        this.pattern = builder.pattern;
        this.replacement = builder.replacement;
        this.editorPattern = builder.editorPattern;
        this.editorReplacement = builder.editorReplacement;
        this.isSystem = builder.isSystem;
    }


    newBuilderFromCurrent (): Builder {
        return new Builder(this);
    }

    static newBuilder (): Builder {
        return new Builder();
    }

    static of (req: InternalRequest): BbcodeEntity {
        return this.newBuilder()
            .withBbcodeId(req.body.bbcodeId)
            .withName(req.body.name)
            .withExample(req.body.example)
            .withPattern(req.body.pattern)
            .withReplacement(req.body.replacement)
            .withEditorPattern(req.body.editorPattern)
            .withEditorReplacement(req.body.editorReplacement)
            .build();
    }
}

class Builder {
    private myData: IBbcode = {
        bbcodeId: undefined,
        name: undefined,
        example: undefined,
        pattern: undefined,
        replacement: undefined,
        editorPattern: undefined,
        editorReplacement: undefined,
        isSystem: undefined
    };

    constructor (entity?: IBbcode) {
        Object.assign(this.myData, entity);
    }

    withBbcodeId (bbcodeId: number): Builder {
        this.myData.bbcodeId = bbcodeId;
        return this;
    }

    withName (name: string): Builder {
        this.myData.name = name;
        return this;
    }

    withExample (example: string): Builder {
        this.myData.example = example;
        return this;
    }

    withPattern (pattern: string): Builder {
        this.myData.pattern = pattern;
        return this;
    }

    withReplacement (replacement: string): Builder {
        this.myData.replacement = replacement;
        return this;
    }

    withEditorPattern (editorPattern: string): Builder {
        this.myData.editorPattern = editorPattern;
        return this;
    }

    withEditorReplacement (editorReplacement: string): Builder {
        this.myData.editorReplacement = editorReplacement;
        return this;
    }

    withIsSystem (isSystem: boolean): Builder {
        this.myData.isSystem = isSystem;
        return this;
    }

    build (): BbcodeEntity {
        return new BbcodeEntity(this.myData);
    }
}
