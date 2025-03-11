import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum Role {
  MAFIA = 'mafia',
  POLICE = 'police',
  DOCTOR = 'doctor',
  CITIZEN = 'citizen',
}

@Entity()
export class GameResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gameId: string; // 게임 ID (같은 게임의 플레이어를 그룹화)

  @Column()
  userId: number; // 개별 플레이어 ID

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;

  @Column()
  alive: string; // 'alive' 또는 'dead' (boolean 대신 문자열로 변경)

  @Column()
  winningTeam: string; // 게임 승리 팀

  @Column()
  result: string; // 'win' 또는 'lose' (승패 추가)

  @CreateDateColumn()
  timestamp: Date; // 생성 시간
}
