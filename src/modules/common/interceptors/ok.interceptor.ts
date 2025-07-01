import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type Response<T> = {
  message: 'ok';
  data: T;
  time: number;
};

@Injectable()
export class OkInterceptor<T> implements NestInterceptor<T, Response<T>> {
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        data,
        message: 'ok',
        time: Date.now(),
      })),
    );
  }
}
