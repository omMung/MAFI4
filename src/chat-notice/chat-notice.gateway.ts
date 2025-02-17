import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { ChatNoticeService } from './chat-notice.service';
import { CreateChatNoticeDto } from './dto/create-chat-notice.dto';
import { UpdateChatNoticeDto } from './dto/update-chat-notice.dto';

@WebSocketGateway()
export class ChatNoticeGateway {
  constructor(private readonly chatNoticeService: ChatNoticeService) {}

  @SubscribeMessage('createChatNotice')
  create(@MessageBody() createChatNoticeDto: CreateChatNoticeDto) {
    return this.chatNoticeService.create(createChatNoticeDto);
  }

  @SubscribeMessage('findAllChatNotice')
  findAll() {
    return this.chatNoticeService.findAll();
  }

  @SubscribeMessage('findOneChatNotice')
  findOne(@MessageBody() id: number) {
    return this.chatNoticeService.findOne(id);
  }

  @SubscribeMessage('updateChatNotice')
  update(@MessageBody() updateChatNoticeDto: UpdateChatNoticeDto) {
    return this.chatNoticeService.update(updateChatNoticeDto.id, updateChatNoticeDto);
  }

  @SubscribeMessage('removeChatNotice')
  remove(@MessageBody() id: number) {
    return this.chatNoticeService.remove(id);
  }
}
