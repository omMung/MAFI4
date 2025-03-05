import { PartialType } from '@nestjs/mapped-types';
import { CreateUserAchievementProgressDto } from './create-user-achievement-progress.dto';

export class UpdateUserAchievementProgressDto extends PartialType(CreateUserAchievementProgressDto) {}
