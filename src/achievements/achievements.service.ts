import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AchieveRepository } from './achievements.repository';
import { Achieve } from './entities/achievement.entity';
import { UserAchievements } from '../user-achievements/entities/users-achievement.entity';
import { UserAchievementsRepository } from '../user-achievements/users-achievements.repository';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AchievementsService {
  constructor(
    private readonly achieveRepository: AchieveRepository,
    private readonly userAchievementsRepository: UserAchievementsRepository,
  ) {}

  /** 새로운 업적 생성 (중복 확인 후 저장) */
  async createAchieve(achieveData: Partial<Achieve>): Promise<Achieve> {
    const exists = await this.achieveRepository.existsByConditionAndCount(
      achieveData.condition,
      achieveData.conditionCount,
    );
    if (exists) {
      throw new BadRequestException(
        `이미 존재하는 업적입니다: ${achieveData.condition}`,
      );
    }
    return await this.achieveRepository.createAchieve(achieveData);
  }

  /** 모든 업적 조회 */
  async getAllAchievements(): Promise<Achieve[]> {
    return await this.achieveRepository.findAllAchievements();
  }

  /** 특정 업적 조회 */
  async getAchievementById(achieveId: number): Promise<Achieve> {
    const achievement =
      await this.achieveRepository.findAchievementById(achieveId);
    if (!achievement) {
      throw new NotFoundException(
        `해당 업적을 찾을 수 없습니다 (ID: ${achieveId})`,
      );
    }
    return achievement;
  }

  /** 업적 업데이트 */
  async updateAchievement(
    achieveId: number,
    updateData: Partial<Achieve>,
  ): Promise<Achieve> {
    return await this.achieveRepository.updateAchievement(
      achieveId,
      updateData,
    );
  }

  /** 업적 삭제 */
  async deleteAchievement(achieveId: number): Promise<void> {
    await this.getAchievementById(achieveId);
    await this.achieveRepository.deleteAchievement(achieveId);
  }

  /** JSON 파일에서 업적을 불러와 DB에 저장 (중복 방지) */
  async loadAchievementsFromJson(): Promise<void> {
    const jsonFilePath = path.join(
      process.cwd(),
      'src',
      'achievements',
      'achievements.list.json',
    );
    const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
    const { achievements }: { achievements: Achieve[] } = JSON.parse(jsonData);

    for (const achievement of achievements) {
      const exists = await this.achieveRepository.existsByConditionAndCount(
        achievement.condition,
        achievement.conditionCount,
      );

      if (!exists) {
        await this.achieveRepository.createAchieve(achievement);
      }
    }
  }

  /**
   * 게임 업적을 기반으로 일반 업적을 저장 및 업데이트
   * @param gameId 게임 ID
   * @param playerAchievements 플레이어 업적 데이터
   */
  async processGameAchievements(
    gameId: string,
    playerAchievements: Record<string, Record<string, string>> = {},
  ) {
    // 1. JSON 파일에서 일반 업적 데이터 로드
    const jsonFilePath = path.join(
      process.cwd(),
      'src',
      'achievements',
      'achievements.list.json',
    );
    const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
    const { achievements }: { achievements: Achieve[] } = JSON.parse(jsonData);

    if (!gameId || Object.keys(playerAchievements).length === 0) {
      console.warn(
        `게임 업적 데이터가 올바르지 않음. 처리 중단 (gameId: ${gameId})`,
      );
      return;
    }

    const userAchievementsToSave: UserAchievements[] = [];

    // 2. 플레이어별 업적 확인
    for (const [userId, stats] of Object.entries(playerAchievements)) {
      if (!stats || typeof stats !== 'object') continue;

      for (const [achievementType, value] of Object.entries(stats)) {
        const countValue = isNaN(Number(value)) ? 0 : Number(value);

        // 3. 해당 게임 업적(`achievementType`, `value`)이 업적 데이터(`condition`, `conditionCount`)와 일치하는지 확인
        const matchedAchievements = achievements.filter(
          (achieve) =>
            achieve.condition === achievementType &&
            achieve.conditionCount === countValue,
        );

        for (const matchedAchievement of matchedAchievements) {
          // 4. 기존 유저 업적이 있는지 확인
          let existingAchievement =
            await this.userAchievementsRepository.findUserAchievementByUserAndAchieve(
              Number(userId),
              matchedAchievement.id,
            );

          if (!existingAchievement) {
            // 기존 업적이 없으면 저장
            existingAchievement =
              await this.userAchievementsRepository.createUserAchievement({
                userId: Number(userId),
                achieveId: matchedAchievement.id,
                value: matchedAchievement.conditionCount,
                achievedAt: new Date(),
              });
            userAchievementsToSave.push(existingAchievement);
          }
        }
      }
    }

    // 5. 새로운 업적 저장 또는 업데이트
    if (userAchievementsToSave.length > 0) {
      await this.userAchievementsRepository.saveUserAchievements(
        userAchievementsToSave,
      );
      console.log(`일반 업적 저장 완료 (gameId: ${gameId})`);
    }
  }
}
