import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { Achieve } from './entities/achievement.entity';

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  /** 새로운 업적 생성 (중복 확인 후 저장) */
  @Post()
  async create(@Body() achieveData: Partial<Achieve>): Promise<Achieve> {
    return this.achievementsService.createAchieve(achieveData);
  }

  /** 모든 업적 조회 */
  @Get()
  async findAll(): Promise<Achieve[]> {
    return this.achievementsService.getAllAchievements();
  }

  /** 특정 업적 조회 */
  @Get(':achieveId')
  async findOne(
    @Param('achieveId', ParseIntPipe) achieveId: number,
  ): Promise<Achieve> {
    return this.achievementsService.getAchievementById(achieveId);
  }

  /** 업적 업데이트 */
  @Patch(':achieveId')
  async update(
    @Param('achieveId', ParseIntPipe) achieveId: number,
    @Body() updateData: Partial<Achieve>,
  ): Promise<Achieve> {
    return this.achievementsService.updateAchievement(achieveId, updateData);
  }

  /** 업적 삭제 */
  @Delete(':achieveId')
  async delete(
    @Param('achieveId', ParseIntPipe) achieveId: number,
  ): Promise<{ message: string }> {
    try {
      await this.achievementsService.deleteAchievement(achieveId);
      return { message: `업적 ID ${achieveId}가 삭제되었습니다.` };
    } catch (error) {
      throw new Error(`업적 삭제 실패: ${error.message}`);
    }
  }

  /** JSON 파일에서 업적을 불러와 DB에 저장 (중복 방지) */
  @Post('load')
  async loadAchievements(): Promise<{ message: string }> {
    await this.achievementsService.loadAchievementsFromJson();
    return { message: '업적 데이터가 성공적으로 로드되었습니다.' };
  }
}
