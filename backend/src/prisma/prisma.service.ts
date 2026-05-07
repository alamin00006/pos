import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Manages Prisma client lifecycle and shared persistence helpers.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });
  }

  /**
   * Initializes the database connection when the module starts.
   */
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');

    // Log queries in development
    if (process.env.NODE_ENV === 'development') {
      (this as any).$on('query', (e: any) => {
        this.logger.debug(`Query: ${e.query}`);
        this.logger.debug(`Duration: ${e.duration}ms`);
      });
    }
  }

  /**
   * Closes the database connection during module shutdown.
   */
  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }

  // Helper for soft delete queries
  /**
   * Returns the standard filter for active, non-deleted records.
   */
  notDeleted() {
    return { deletedAt: null };
  }

  // Helper for soft delete
  /**
   * Returns the standard payload used to mark a record as deleted.
   */
  softDelete() {
    return { deletedAt: new Date() };
  }
}
