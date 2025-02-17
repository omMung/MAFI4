import { Injectable } from '@nestjs/common';
import { CreateChatNoticeDto } from './dto/create-chat-notice.dto';
import { UpdateChatNoticeDto } from './dto/update-chat-notice.dto';

@Injectable()
export class ChatNoticeService {
  create(createChatNoticeDto: CreateChatNoticeDto) {
    return 'This action adds a new chatNotice';
  }

  findAll() {
    return `This action returns all chatNotice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatNotice`;
  }

  update(id: number, updateChatNoticeDto: UpdateChatNoticeDto) {
    return `This action updates a #${id} chatNotice`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatNotice`;
  }
}
