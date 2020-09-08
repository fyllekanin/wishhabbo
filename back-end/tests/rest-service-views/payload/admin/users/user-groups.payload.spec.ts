import { InternalRequest } from '../../../../../src/utilities/internal.request';
import { UserGroupsView } from '../../../../../src/rest-service-views/two-way/user-groups.view';

describe('UserGroupsPayload', () => {

    it('should be correct after using of', () => {
        // Given
        const req = <InternalRequest><unknown>{
            body: {
                userId: 55,
                groupIds: [ 1, 2, 3 ],
                displayGroupId: 1
            }
        };

        // When
        const result = UserGroupsView.of(req);

        // Then
        expect(result.getUserId()).toEqual(55);
        expect(result.getDisplayGroupId()).toEqual(1);
        expect(result.getSelectedGroupIds()).toEqual([ 1, 2, 3 ]);
    });

});
