import { SlimUserView } from '../../src/rest-service-views/slim-user.view';

describe('SlimUserView', () => {
    it('should be possible to build', () => {
        // When
        const view = SlimUserView.newBuilder()
            .withUserId(0)
            .withUsername('username')
            .withHabbo('habbo')
            .withUpdatedAt(1)
            .build();

        // Then
        expect(view.getUserId()).toEqual(0);
        expect(view.getUsername()).toEqual('username');
        expect(view.getHabbo()).toEqual('habbo');
        expect(view.getUpdatedAt()).toEqual(1);
    });
});
