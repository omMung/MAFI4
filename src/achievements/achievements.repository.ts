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
    return !!(await this.findAchievementByCondition(condition));
  }

  /** 특정 조건과 카운트의 업적이 존재하는지 확인 */
  async existsByConditionAndCount(
    condition: string,
    conditionCount: number,
  ): Promise<boolean> {
    return !!(await this.findAchievementByConditionAndCount(
      condition,
      conditionCount,
    ));
  }

  /** 특정 조건에 맞는 업적 조회 */
  async findAchievementByCondition(
    condition: string,
  ): Promise<Achieve | undefined> {
    return await this.achieveRepository.findOne({ where: { condition } });
  }

  /** 특정 조건과 카운트가 일치하는 업적 조회 */
  async findAchievementByConditionAndCount(
    condition: string,
    conditionCount: number,
  ): Promise<Achieve | undefined> {
    return await this.achieveRepository.findOne({
      where: { condition, conditionCount },
    });
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

  /** JSON 파일에서 업적을 불러올 때 중복을 방지하고 생성하는 메서드 */
  async createAchievementsBulk(achievements: Achieve[]): Promise<void> {
    const existingAchievements = await this.achieveRepository.find({
      select: ['condition', 'conditionCount'],
    });

    const existingSet = new Set(
      existingAchievements.map((a) => `${a.condition}-${a.conditionCount}`),
    );

    const newAchievements = achievements.filter(
      (achieve) =>
        !existingSet.has(`${achieve.condition}-${achieve.conditionCount}`),
    );

    if (newAchievements.length > 0) {
      await this.achieveRepository.save(newAchievements);
    }
  }
}
