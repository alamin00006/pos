import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const settings = await this.prisma.setting.findMany();
    return settings.reduce((acc: any, s) => ({ ...acc, [s.key]: s.value }), {});
  }

  async get(key: string) {
    const setting = await this.prisma.setting.findUnique({ where: { key } });
    return setting?.value;
  }

  async set(key: string, value: string) {
    return this.prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

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
