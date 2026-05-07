import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Coordinates Settings business logic, validation, and persistence workflows.
 */
@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieves filtered Settings records for API consumers.
   */
  async findAll() {
    const settings = await this.prisma.setting.findMany();
    return settings.reduce((acc: any, s) => ({ ...acc, [s.key]: s.value }), {});
  }

  /**
   * Handles the get workflow for Settings records.
   */
  async get(key: string) {
    const setting = await this.prisma.setting.findUnique({ where: { key } });
    return setting?.value;
  }

  /**
   * Handles the set workflow for Settings records.
   */
  async set(key: string, value: string) {
    return this.prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  /**
   * Handles the set many workflow for Settings records.
   */
  async setMany(settings: Record<string, string>) {
    const operations = Object.entries(settings).map(([key, value]) =>
      this.prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      }),
    );
    await this.prisma.$transaction(operations);
    return this.findAll();
  }
}
