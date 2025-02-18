import { Injectable } from '@nestjs/common';
import { ChatNoticeGateway } from './chat-notice.gateway';

@Injectable()
export class ChatNoticeService {
  constructor(private readonly chatNoticeGateway: ChatNoticeGateway) {}

  policeAction(userId: string) {
    this.chatNoticeGateway.sendNotice(
      'police',
      `${userId}가 한 명을 조사했습니다.`,
    );
  }

  doctorAction(userId: string) {
    this.chatNoticeGateway.sendNotice(
      'doctor',
      `${userId}가 누군가를 치료했습니다.`,
    );
  }

  mafiaAction(userId: string) {
    this.chatNoticeGateway.sendNotice(
      'mafia',
      `${userId}가 한 명을 공격했습니다.`,
    );
  }
}
