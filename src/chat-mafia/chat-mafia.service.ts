import { Injectable } from '@nestjs/common';
import { CreateChatMafiaDto } from './dto/create-chat-mafia.dto';
import { UpdateChatMafiaDto } from './dto/update-chat-mafia.dto';

@Injectable()
export class ChatMafiaService {
  // create(createChatMafiaDto: CreateChatMafiaDto) {
  //   return 'This action adds a new chatMafia';
  // }

  // findAll() {
  //   return `This action returns all chatMafia`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} chatMafia`;
  // }

  // update(id: number, updateChatMafiaDto: UpdateChatMafiaDto) {
  //   return `This action updates a #${id} chatMafia`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} chatMafia`;
  // }
  communicateMafia(userId: number) {}
}
