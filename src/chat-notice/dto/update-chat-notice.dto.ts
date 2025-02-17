import { PartialType } from '@nestjs/mapped-types';
import { CreateChatNoticeDto } from './create-chat-notice.dto';

export class UpdateChatNoticeDto extends PartialType(CreateChatNoticeDto) {
  id: number;
}
