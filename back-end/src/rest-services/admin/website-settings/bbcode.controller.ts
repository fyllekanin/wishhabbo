import { Controller, Delete, Get, Post, Put } from '@overnightjs/core';
import { InternalRequest } from '../../../utilities/internal.request';
import { Response } from 'express';
import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import { BbcodeEntity } from '../../../persistance/entities/settings/bbcode.entity';
import { ValidationValidators } from '../../../validation/validation.validators';
import { LogTypes } from '../../../logging/log.types';
import { Logger } from '../../../logging/log.logger';

@Controller('api/admin/website-settings/bbcodes')
export class BbcodeController {

    @Get(':bbcodeId')
    private async getBbcode (req: InternalRequest, res: Response): Promise<void> {
        const bbcode = await req.serviceConfig.bbcodeRepository.get(Number(req.params.bbcodeId));
        if (!bbcode) {
            res.status(NOT_FOUND).json();
            return;
        }

        res.status(OK).json(bbcode);
    }

    @Post()
    private async createBbcode (req: InternalRequest, res: Response): Promise<void> {
        const entity = BbcodeEntity.of(req);
        const errors = await ValidationValidators.validateEntity(entity, req.serviceConfig, req.user);
        if (errors.length > 0) {
            res.status(BAD_REQUEST).json(errors);
            return;
        }

        const created = await req.serviceConfig.bbcodeRepository.save(entity);

        await Logger.createAdminLog(req, {
            id: LogTypes.CREATED_BBCODE,
            contentId: created.bbcodeId,
            userId: req.user.userId,
            beforeChange: null,
            afterChange: JSON.stringify(created)
        });
        res.status(OK).json(created.bbcodeId);
    }

    @Put(':bbcodeId')
    private async updateBbcode (req: InternalRequest, res: Response): Promise<void> {
        const existing = await req.serviceConfig.bbcodeRepository.get(Number(req.params.bbcodeId));
        if (!existing || existing.isSystem) {
            res.status(NOT_FOUND).json();
            return;
        }

        const entity = BbcodeEntity.of(req);
        const errors = await ValidationValidators.validateEntity(entity, req.serviceConfig, req.user);
        if (errors.length > 0) {
            res.status(BAD_REQUEST).json(errors);
            return;
        }

        const updated = existing.newBuilderFromCurrent()
            .withName(entity.name)
            .withExample(entity.example)
            .withPattern(entity.pattern)
            .withReplacement(entity.replacement)
            .withEditorPattern(entity.editorPattern)
            .withEditorReplacement(entity.editorReplacement)
            .build();

        await req.serviceConfig.bbcodeRepository.save(updated);

        await Logger.createAdminLog(req, {
            id: LogTypes.UPDATED_BBCODE,
            contentId: updated.bbcodeId,
            userId: req.user.userId,
            beforeChange: JSON.stringify(existing),
            afterChange: JSON.stringify(updated)
        });
        res.status(OK).json();
    }

    @Delete(':bbcodeId')
    private async deleteBbcode (req: InternalRequest, res: Response): Promise<void> {
        const existing = await req.serviceConfig.bbcodeRepository.get(Number(req.params.bbcodeId));
        if (!existing || existing.isSystem) {
            res.status(NOT_FOUND).json();
            return;
        }

        await req.serviceConfig.bbcodeRepository.delete(existing);

        await Logger.createAdminLog(req, {
            id: LogTypes.DELETED_BBCODE,
            contentId: existing.bbcodeId,
            userId: req.user.userId,
            beforeChange: JSON.stringify(existing),
            afterChange: null
        });
        res.status(OK).json();
    }
}
