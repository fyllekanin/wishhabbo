import { InternalRequest } from '../../../../../src/utilities/internal.request';
import { UserDetailsPayload } from '../../../../../src/rest-service-views/payloads/admin/users/user-details.payload';

describe('UserDetailsPayload', () => {

    it('should be correct after using of', () => {
        // Given
        const req = <InternalRequest><unknown>{
            body: {
                username: 'username',
                habbo: 'habbo',
                password: 'password',
                repassword: 'repassword'
            }
        };

        // When
        const result = UserDetailsPayload.of(req);

        // Then
        expect(result.getUsername()).toEqual('username');
        expect(result.getHabbo()).toEqual('habbo');
        expect(result.getPassword()).toEqual('password');
        expect(result.getRepassword()).toEqual('repassword');
    });

});
