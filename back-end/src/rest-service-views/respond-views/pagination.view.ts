export class PaginationView<T> {
    private readonly items: Array<T>;
    private readonly page: number;
    private readonly total: number;

    constructor (builder: PaginationViewBuilder<T>) {
        this.items = [ ...builder.items ];
        this.page = builder.page;
        this.total = builder.total;
    }

    getItems (): Array<T> {
        return [ ...this.items ];
    }

    getPage (): number {
        return this.page;
    }

    getTotal (): number {
        return this.total;
    }

    static newBuilder<T> (): PaginationViewBuilder<T> {
        return new PaginationViewBuilder<T>();
    }
}

class PaginationViewBuilder<T> {
    items: Array<T>;
    page: number;
    total: number;

    withItems (items: Array<T>): PaginationViewBuilder<T> {
        this.items = Array.isArray(items) ? items : [];
        return this;
    }

    withPage (page: number): PaginationViewBuilder<T> {
        this.page = page;
        return this;
    }

    withTotal (total: number): PaginationViewBuilder<T> {
        this.total = total;
        return this;
    }

    build (): PaginationView<T> {
        return new PaginationView<T>(this);
    }
}
