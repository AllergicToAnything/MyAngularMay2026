import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Data {
  private eventSubject = new Subject();

  constructor() {}

  publishEvent(data: any) {
    this.eventSubject.next(data);
  }

  observeEvent(): Subject<any> {
    return this.eventSubject;
  }
}
