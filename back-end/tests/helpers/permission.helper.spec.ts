import { PermissionHelper } from '../../src/helpers/permission.helper';
import { GroupEntity } from '../../src/persistance/entities/group/group.entity';
import { GroupRepository } from '../../src/persistance/repositories/group.repository';
import { UserEntity } from '../../src/persistance/entities/user/user.entity';

describe('PermissionHelper', () => {

    it('getConvertedStaffPermissionsToNumber should return correctly converted value', () => {
        // Given
        const obj = {
            CAN_BOOK_RADIO: true,
            CAN_BOOK_EVENTS: false
        };

        // When
        const result = PermissionHelper.getConvertedStaffPermissionsToNumber(obj);

        // Then
        expect(result).toEqual(1);
    });

    it('getConvertedAdminPermissionsToNumber should return correctly converted value', () => {
        // Given
        const obj = {
            CAN_MANAGE_USER_GROUPS: true,
            CAN_SEE_LOGS: false
        };

        // When
        const result = PermissionHelper.getConvertedAdminPermissionsToNumber(obj);

        // Then
        expect(result).toEqual(4);
    });

    it('getConvertedStaffPermissionsToUI should return a correct StaffPermission object', () => {
        // Given
        const entity = new GroupEntity();
        entity.staffPermissions = 12;

        // When
        const result = PermissionHelper.getConvertedStaffPermissionsToUI(entity);

        // Then
        expect(result.CAN_BOOK_RADIO).toBeFalse();
        expect(result.CAN_BOOK_EVENTS).toBeFalse();
        expect(result.CAN_UNBOOK_OTHERS_RADIO).toBeTrue();
        expect(result.CAN_UNBOOK_OTHERS_EVENTS).toBeTrue();
    });

    it('getConvertedAdminPermissionsToUI should return a correct StaffPermission object', () => {
        // Given
        const entity = new GroupEntity();
        entity.adminPermissions = 3;

        // When
        const result = PermissionHelper.getConvertedAdminPermissionsToUI(entity);

        // Then
        expect(result.CAN_MANAGE_GROUPS).toBeTrue();
        expect(result.CAN_MANAGE_USER_BASICS).toBeTrue();
        expect(result.CAN_MANAGE_USER_GROUPS).toBeFalse();
        expect(result.CAN_MANAGE_WEBSITE_SETTINGS).toBeFalse();
    });

    it('getConvertedStaffPermissionsForUser should return correct permissions', async () => {
        // Given
        const user = <UserEntity><unknown>{ userId: 1 };
        const groupRepository = <GroupRepository><unknown>{
            haveStaffPermission: (_userId: number, _permission: number) => true
        };

        // When
        const result = await PermissionHelper.getConvertedStaffPermissionsForUser(user, groupRepository);

        // Then
        expect(result.CAN_UNBOOK_OTHERS_RADIO).toBeTrue();
    });

    it('getConvertedAdminPermissionsForUser should return correct permissions', async () => {
        // Given
        const user = <UserEntity><unknown>{ userId: 1 };
        const groupRepository = <GroupRepository><unknown>{
            haveAdminPermission: (_userId: number, _permission: number) => true
        };

        // When
        const result = await PermissionHelper.getConvertedAdminPermissionsForUser(user, groupRepository);

        // Then
        expect(result.CAN_MANAGE_GROUPS).toBeTrue();
    });
});
