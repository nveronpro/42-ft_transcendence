import { User } from "../../users/entities/user.entity";

export class CreatePrivateChatDto {

	name: string;

	user1: User;

	user2: User;
	
}
