import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm';
import { GroupEntity } from '../entities/group/group.entity';
import { GroupRepository } from '../repositories/group.repository';
import { UserRepository } from '../repositories/user/user.repository';

@EventSubscriber()
export class GroupSubscriber implements EntitySubscriberInterface {

    listenTo (): Function {
        return GroupEntity;
    }

    async afterRemove (event: RemoveEvent<GroupEntity>): Promise<void> {
        const groupRepository = new GroupRepository();
        const userRepository = new UserRepository();
        await groupRepository.deleteUsersFromGroup(event.entity.groupId);
        await userRepository.removeDisplayGroupId(event.entity.groupId);
    }
}
