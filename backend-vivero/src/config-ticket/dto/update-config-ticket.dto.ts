import { PartialType } from '@nestjs/mapped-types';
import { CreateConfigTicketDto } from './create-config-ticket.dto';

export class UpdateConfigTicketDto extends PartialType(CreateConfigTicketDto) {}
