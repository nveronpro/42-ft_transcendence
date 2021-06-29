import { User } from "../../users/entities/user.entity";

export class CreateFriendRequestDto {

	sender: User;

	receiver: User;
}
