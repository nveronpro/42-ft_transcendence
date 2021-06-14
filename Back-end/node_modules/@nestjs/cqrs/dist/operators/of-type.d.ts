import { Type } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IEvent } from '../interfaces';
export declare function ofType<TInput extends IEvent, TOutput extends IEvent>(...types: Type<TOutput>[]): (source: Observable<TInput>) => Observable<TOutput>;
