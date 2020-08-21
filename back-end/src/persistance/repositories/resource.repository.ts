import * as fileSystem from 'fs';
import { ResourceConstants } from '../../constants/resource.constants';
import { InternalRequest } from '../../utilities/internal.request';

export class ResourceRepository {

    isFileValidImage (file: any): boolean {
        return file.type.includes('image/');
    }

    async isFileExisting (path: string, name: string): Promise<boolean> {
        return fileSystem.existsSync(`${path}/${name}`);
    }

    async uploadArticleThumbnail (req: InternalRequest, name: string): Promise<boolean> {
        return new Promise(res => {

            const oldPath = req.files.thumbnail.path;
            const newPath = `${ResourceConstants.ARTICLE_THUMBNAILS}/${name}`;
            const rawData = fileSystem.readFileSync(oldPath);

            fileSystem.writeFile(newPath, rawData, err => {
                if (err) {
                    res(false);
                    return;
                }
                res(true);
            });
        });
    }
}
