import { User } from "../../users/entities/user.entity";
import { Chat } from "../entities/chat.entity";
import { UserRole } from "../entities/userStatus.enum";

export class CreateChatUserDto {

	chat: Chat

	user: User
	
	userRole: UserRole;
}
