import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationView } from '../../rest-service-views/respond-views/pagination.view';
import { PaginationHelper } from '../../helpers/pagination.helper';

interface PaginationOptions {
    page: number;
    take: number;
    orderBy?: { sort: string, order?: 'ASC' | 'DESC' };
    where?: Array<{ key: string, operator: string, value: string | number }>;
}

export class BaseRepository<T> {
    protected repository: Repository<T>;

    async save (entity: T): Promise<T> {
        return await this.repository.save(entity);
    }

    async delete (entity: T): Promise<DeleteResult> {
        return await this.repository.delete(entity);
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
            .withTotal(PaginationHelper.getTotalAmountOfPages(options.take, await this.getBaseQuery(options).getCount()))
            .withPage(options.page)
            .withItems(items)
            .build();
    }

    private getBaseQuery (options: PaginationOptions): SelectQueryBuilder<T> {
        const baseQuery = this.repository.createQueryBuilder();

        (options.where || []).forEach(where => {
            baseQuery.where(`${where.key} ${where.operator} :${where.key}`);
            baseQuery.setParameter(where.key, where.value);
        });
        return baseQuery;
    }
}
