import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { ChatMafiaService } from './chat-mafia.service';
import { CreateChatMafiaDto } from './dto/create-chat-mafia.dto';
import { UpdateChatMafiaDto } from './dto/update-chat-mafia.dto';

@WebSocketGateway()
export class ChatMafiaGateway {
  constructor(private readonly chatMafiaService: ChatMafiaService) {}

  @SubscribeMessage('createChatMafia')
  create(@MessageBody() createChatMafiaDto: CreateChatMafiaDto) {
    return this.chatMafiaService.create(createChatMafiaDto);
  }

  @SubscribeMessage('findAllChatMafia')
  findAll() {
    return this.chatMafiaService.findAll();
  }

  @SubscribeMessage('findOneChatMafia')
  findOne(@MessageBody() id: number) {
    return this.chatMafiaService.findOne(id);
  }

  @SubscribeMessage('updateChatMafia')
  update(@MessageBody() updateChatMafiaDto: UpdateChatMafiaDto) {
    return this.chatMafiaService.update(updateChatMafiaDto.id, updateChatMafiaDto);
  }

  @SubscribeMessage('removeChatMafia')
  remove(@MessageBody() id: number) {
    return this.chatMafiaService.remove(id);
  }
}
