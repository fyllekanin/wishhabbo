import { InternalRequest } from '../../../../../src/utilities/internal.request';
import { UserGroupsPayload } from '../../../../../src/rest-service-views/payloads/admin/users/user-groups.payload';

describe('UserGroupsPayload', () => {

    it('should be correct after using of', () => {
        // Given
        const req = <InternalRequest><unknown>{
            body: {
                groupIds: [ 1, 2, 3 ],
                displayGroupId: 1
            }
        };

        // When
        const result = UserGroupsPayload.of(req);

        // Then
        expect(result.getDisplayGroupId()).toEqual(1);
        expect(result.getGroupIds()).toEqual([ 1, 2, 3 ]);
    });

});
