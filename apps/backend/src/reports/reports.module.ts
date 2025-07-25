import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { StorageService } from '../storage/storage.service';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, StorageService],
  exports: [ReportsService],
})
export class ReportsModule { }