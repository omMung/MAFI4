import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achieve } from './entities/achievement.entity';

@Injectable()
export class AchieveRepository {
  constructor(
    @InjectRepository(Achieve)
    private achieveRepository: Repository<Achieve>,
  ) {}

  /** 새로운 업적 생성 */
  async createAchieve(achieveData: Partial<Achieve>): Promise<Achieve> {
    const achieveEntity = this.achieveRepository.create(achieveData);
    return await this.achieveRepository.save(achieveEntity);
  }

  /** 모든 업적 조회 */
  async findAllAchievements(): Promise<Achieve[]> {
    return await this.achieveRepository.find();
  }

  /** 특정 업적 조회 */
  async findAchievementById(achieveId: number): Promise<Achieve | undefined> {
    return await this.achieveRepository.findOne({ where: { id: achieveId } });
  }

  /** 특정 조건의 업적이 존재하는지 확인 */
  async existsByCondition(condition: string): Promise<boolean> {
    const achievement = await this.achieveRepository.findOne({
      where: { condition },
    });
    return !!achievement; // 업적이 존재하면 true, 없으면 false 반환
  }

  /** 업적 업데이트 */
  async updateAchievement(
    achieveId: number,
    updateData: Partial<Achieve>,
  ): Promise<Achieve> {
    const achievement = await this.achieveRepository.findOne({
      where: { id: achieveId },
    });

    if (!achievement) {
      throw new Error(`업적 ID ${achieveId}를 찾을 수 없습니다.`);
    }

    // 기존 값 업데이트
    Object.assign(achievement, updateData);
    return await this.achieveRepository.save(achievement);
  }

  /** 업적 삭제 */
  async deleteAchievement(achieveId: number): Promise<void> {
    await this.achieveRepository.delete(achieveId);
  }

  /**
   * 게임 업적을 저장할 때 특정 업적을 찾는 메서드
   * (AchievementsService.processGameAchievements에서 사용됨)
   */
  async findAchievementByCondition(
    condition: string,
  ): Promise<Achieve | undefined> {
    return await this.achieveRepository.findOne({ where: { condition } });
  }

  /**
   * JSON 파일에서 업적을 불러올 때 중복을 방지하고 생성하는 메서드
   * (AchievementsService.loadAchievementsFromJson에서 사용됨)
   */
  async createAchievementsBulk(achievements: Achieve[]): Promise<void> {
    const existingConditions = await this.achieveRepository
      .createQueryBuilder('achieve')
      .select('achieve.condition')
      .getMany();

    const existingConditionSet = new Set(
      existingConditions.map((a) => a.condition),
    );

    const newAchievements = achievements.filter(
      (achieve) => !existingConditionSet.has(achieve.condition),
    );

    if (newAchievements.length > 0) {
      await this.achieveRepository.save(newAchievements);
    }
  }
}
