import { PartialType } from '@nestjs/mapped-types';
import { CreateChatMafiaDto } from './create-chat-mafia.dto';

export class UpdateChatMafiaDto extends PartialType(CreateChatMafiaDto) {
  id: number;
}
