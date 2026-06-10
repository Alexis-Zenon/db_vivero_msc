import { PartialType } from '@nestjs/mapped-types';
import { CreateMermaDto } from './create-merma.dto';

export class UpdateMermaDto extends PartialType(CreateMermaDto) {}
