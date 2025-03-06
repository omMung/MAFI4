import { PartialType } from '@nestjs/mapped-types';
import { CreateUserItemDto } from './create-user-item.dto';

export class UpdateUserItemDto extends PartialType(CreateUserItemDto) {}
