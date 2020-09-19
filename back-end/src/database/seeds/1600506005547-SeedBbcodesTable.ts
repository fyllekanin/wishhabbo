import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import { BbcodeEntity } from '../../persistance/entities/settings/bbcode.entity';

export class SeedBbcodesTable1600506005547 implements MigrationInterface {

    async up (queryRunner: QueryRunner): Promise<void> {
        await getRepository(BbcodeEntity).save([
            BbcodeEntity.newBuilder()
                .withName('bold')
                .withExample('[b]bold[/b]')
                .withPattern('\\[b\\](.+?)\\[\\/b\\]')
                .withReplacement('<strong>$1</strong>')
                .withEditorPattern('[b]{DATA}[/b]')
                .withEditorReplacement('<strong>{DATA}</strong>')
                .withIsSystem(true)
                .build(),
            BbcodeEntity.newBuilder()
                .withName('order list')
                .withExample('[ol]list[/ol]')
                .withPattern('\\[ol\\](.+?)\\[\\/ol\\]')
                .withReplacement('<ol>$1</ol>')
                .withEditorPattern('[ol]{DATA}[/ol]')
                .withEditorReplacement('<ol>{DATA}</ol>')
                .withIsSystem(true)
                .build(),
            BbcodeEntity.newBuilder()
                .withName('list item')
                .withExample('[li]list item[/li]')
                .withPattern('\\[li\\](.+?)\\[\\/li\\]')
                .withReplacement('<li>$1</li>')
                .withEditorPattern('[li]{DATA}[/li]')
                .withEditorReplacement('<li>{DATA}</li>')
                .withIsSystem(true)
                .build(),
            BbcodeEntity.newBuilder()
                .withName('unordered list')
                .withExample('[ul]unordered list[/ul]')
                .withPattern('\\[ul\\](.+?)\\[\\/ul\\]')
                .withReplacement('<ul>$1</ul>')
                .withEditorPattern('[ul]{DATA}[/ul]')
                .withEditorReplacement('<ul>{DATA}</ul>')
                .withIsSystem(true)
                .build(),
            BbcodeEntity.newBuilder()
                .withName('image right')
                .withExample('[imgr]image right[/imgr]')
                .withPattern('\\[imgr\\](.+?)\\[\\/imgr\\]')
                .withReplacement('<img src="$1" align="right" />')
                .withEditorPattern('[imgr]{DATA}[/imgr]')
                .withEditorReplacement('<img src="{DATA}" align="right" />')
                .withIsSystem(true)
                .build(),
            BbcodeEntity.newBuilder()
                .withName('image left')
                .withExample('[imgl]image left[/imgl]')
                .withPattern('\\[imgl\\](.+?)\\[\\/imgl\\]')
                .withReplacement('<img src="$1" align="left" />')
                .withEditorPattern('[imgl]{DATA}[/imgl]')
                .withEditorReplacement('<img src="{DATA}" align="left" />')
                .withIsSystem(true)
                .build(),
            BbcodeEntity.newBuilder()
                .withName('A title')
                .withExample('[atitle]title[/atitle]')
                .withPattern('\\[atitle\\](.+?)\\[\\/atitle\\]')
                .withReplacement('<div class="atitle">$1</div>')
                .withEditorPattern('[atitle]{DATA}[/atitle]')
                .withEditorReplacement('<div class="atitle">{DATA}</div>')
                .withIsSystem(true)
                .build()
        ]);
    }

    async down (queryRunner: QueryRunner): Promise<void> {
        // Empty
    }
}
