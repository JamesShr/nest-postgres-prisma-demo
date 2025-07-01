import { PagingData } from '../interfaces/pagingData.interface';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> extends PagingData<T> {
  message: 'ok';
}

@Injectable()
export class PagingInterceptor<T> implements NestInterceptor<T, Response<T>> {
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data: any) => ({
        data: data.data,
        paging: {
          page: data.paging.page,
          limit: data.paging.limit,
          totalCount: data.paging.totalCount,
          totalPages: data.paging.totalPages || 1,
        },
        message: 'ok',
      })),
    );
  }
}
