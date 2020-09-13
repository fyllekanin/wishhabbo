import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationView } from '../../rest-service-views/respond-views/pagination.view';
import { PaginationHelper } from '../../helpers/pagination.helper';

interface PaginationOptions {
    page: number;
    take: number;
    orderBy?: { sort: string, order?: 'ASC' | 'DESC' };
    where?: Array<{
        key: string,
        operator: string,
        value: string | number | Array<string | number>,
        isIn?: boolean,
        isNotIn?: boolean
    }>;
}

export abstract class BaseRepository<T> {
    protected repository: Repository<T>;

    async get (id: number): Promise<T> {
        return await this.getRepository().findOne(id);
    }

    async save (entity: T): Promise<T> {
        return await this.getRepository().save(entity);
    }

    async delete (entity: T): Promise<DeleteResult> {
        return await this.getRepository().delete(entity);
    }

    async paginate (options: PaginationOptions): Promise<PaginationView<T>> {
        const query = this.getBaseQuery(options)
            .take(options.take)
            .skip(PaginationHelper.getSkip(options.page, options.take));

        if (options.orderBy) {
            query.orderBy(options.orderBy.sort, options.orderBy.order);
        }

        const items = await query.getMany();
        return PaginationView.newBuilder<T>()
            .withTotal(PaginationHelper.getTotalAmountOfPages(options.take, await query.getCount()))
            .withPage(options.page)
            .withItems(items)
            .build();
    }

    protected abstract getRepository (): Repository<T>;

    private getBaseQuery (options: PaginationOptions): SelectQueryBuilder<T> {
        const baseQuery = this.getRepository().createQueryBuilder();

        const parameters: any = {};
        (options.where || []).forEach((where, index) => {
            if (where.isIn && where.isNotIn) {
                throw new Error('Can not have both in and not in');
            }
            if ((Array.isArray(where.value) && where.value.length === 0) || !where.value) {
                return;
            }

            const statement = where.isIn || where.isNotIn ?
                `${where.key} ${where.isNotIn ? 'NOT' : ''} IN (:...${where.key})`
                : `${where.key} ${where.operator} :${where.key}`;
            if (index === 0) {
                baseQuery.where(statement);
            } else {
                baseQuery.andWhere(statement);
            }
            parameters[where.key] = where.value;
        });
        baseQuery.setParameters(parameters);
        return baseQuery;
    }
}
