import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MermasService } from './mermas.service';
import { MermasController } from './mermas.controller';
import { Merma } from './entities/merma.entity';
import { Planta } from '../plantas/entities/planta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Merma, Planta])],
  controllers: [MermasController],
  providers: [MermasService],
})
export class MermasModule {}
