import * as path from 'path';

const rootPath = (function () {
    return path.dirname(require.main.filename);
})();

export class ResourceConstants {

    static readonly ARTICLE_THUMBNAILS = rootPath + '/resources/article-thumbnails/';
}
