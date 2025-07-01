import { Subject } from 'rxjs';

export interface SubjectService<T> {
  getSubject(): Subject<T>;
}
