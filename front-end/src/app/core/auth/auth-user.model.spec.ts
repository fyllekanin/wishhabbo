import { AdminPermissions, StaffPermissions, AuthUser } from './auth-user.model';

describe('AuthUserModel', () => {

    describe('StaffPermissions', () => {
        it('doHaveAnyPerm should be false if no permission', () => {
            // When
            const permissions = new StaffPermissions(null);

            // Then
            expect(permissions.doHaveAnyPerm()).toBeFalse();
        });
        it('doHaveAnyPerm should be true if any permission', () => {
            // When
            const permissions = new StaffPermissions({ CAN_KICK_DJ_OFF_AIR: true });

            // Then
            expect(permissions.doHaveAnyPerm()).toBeTrue();
        });
    });

    describe('AdminPermissions', () => {
        it('doHaveAnyPerm should be false if no permission', () => {
            // When
            const permissions = new AdminPermissions(null);

            // Then
            expect(permissions.doHaveAnyPerm()).toBeFalse();
        });
        it('doHaveAnyPerm should be true if any permission', () => {
            // When
            const permissions = new AdminPermissions({ CAN_MANAGE_GROUPS: true });

            // Then
            expect(permissions.doHaveAnyPerm()).toBeTrue();
        });
    });

    describe('AuthUser', () => {
        it('should set doHaveAdminPermissions to false if no admin permissions', () => {
            // When
            const authUser = new AuthUser(null);

            // Then
            expect(authUser.doHaveAdminPermissions).toBeFalse();
        });
        it('should set doHaveAdminPermissions to true if admin permissions', () => {
            // When
            const authUser = new AuthUser({ adminPermissions: new AdminPermissions({ CAN_MANAGE_BBCODES: true }) });

            // Then
            expect(authUser.doHaveAdminPermissions).toBeTrue();
        });
        it('should set doHaveStaffPermissions to false if no admin permissions', () => {
            // When
            const authUser = new AuthUser(null);

            // Then
            expect(authUser.doHaveStaffPermissions).toBeFalse();
        });
        it('should set doHaveStaffPermissions to true if admin permissions', () => {
            // When
            const authUser = new AuthUser({ staffPermissions: new StaffPermissions({ CAN_UPLOAD_RESOURCES: true }) });

            // Then
            expect(authUser.doHaveStaffPermissions).toBeTrue();
        });
    });
});
