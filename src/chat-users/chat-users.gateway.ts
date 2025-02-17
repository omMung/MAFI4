import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { ChatUsersService } from './chat-users.service';
import { CreateChatUserDto } from './dto/create-chat-user.dto';
import { UpdateChatUserDto } from './dto/update-chat-user.dto';

@WebSocketGateway()
export class ChatUsersGateway {
  constructor(private readonly chatUsersService: ChatUsersService) {}

  @SubscribeMessage('createChatUser')
  create(@MessageBody() createChatUserDto: CreateChatUserDto) {
    return this.chatUsersService.create(createChatUserDto);
  }

  @SubscribeMessage('findAllChatUsers')
  findAll() {
    return this.chatUsersService.findAll();
  }

  @SubscribeMessage('findOneChatUser')
  findOne(@MessageBody() id: number) {
    return this.chatUsersService.findOne(id);
  }

  @SubscribeMessage('updateChatUser')
  update(@MessageBody() updateChatUserDto: UpdateChatUserDto) {
    return this.chatUsersService.update(updateChatUserDto.id, updateChatUserDto);
  }

  @SubscribeMessage('removeChatUser')
  remove(@MessageBody() id: number) {
    return this.chatUsersService.remove(id);
  }
}
