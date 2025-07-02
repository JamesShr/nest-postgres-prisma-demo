import { IsOptional, IsPositive, IsNumber, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class PageQueryDto {
  @Transform(({ value }: { value: string }) => {
    return parseInt(value, 10) || 1;
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  public readonly page?: number;

  @Transform(({ value }: { value: string }) => {
    return parseInt(value, 10) || 10;
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(1000)
  public readonly limit?: number;
}

export interface LimitOffset {
    limit?: number;
    offset?: number;
  }

  
  export const DEFAULT_PAGE_QUERY: PageQueryDto = {
    page: 1,
    limit: 50,
  };
  
  export function buildPageQuery(page?: number, limit?: number): PageQueryDto {
    return {
      ...(!Number.isNaN(page) && page !== undefined
        ? { page }
        : { page: DEFAULT_PAGE_QUERY.page }),
      ...(!Number.isNaN(limit) && limit !== undefined
        ? { limit }
        : { limit: DEFAULT_PAGE_QUERY.limit }),
    };
  }

  
  export function buildLimitOffset(dto: PageQueryDto): LimitOffset {
    return {
      limit: dto.limit,
      offset: (dto.page - 1) * dto.limit,
    };
  }
  