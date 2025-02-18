import { PartialType } from '@nestjs/mapped-types';
import { CreateNightResultDto } from './create-night-result.dto';

export class UpdateNightResultDto extends PartialType(CreateNightResultDto) {
  id: number;
}
