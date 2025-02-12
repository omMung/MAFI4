import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersAchievementDto } from './create-users-achievement.dto';

export class UpdateUsersAchievementDto extends PartialType(CreateUsersAchievementDto) {}
