import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Data {
  private eventSubject = new Subject();

  constructor() {}

  saveStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  loadStorage(key: string) {
    const item = localStorage.getItem(key);
    console.log(item);
    return item ? JSON.parse(item) : null;
  }

  removeStorage(key: string) {
    localStorage.removeItem(key);
  }

  publishEvent(data: any) {
    this.eventSubject.next(data);
  }

  observeEvent(): Subject<any> {
    return this.eventSubject;
  }
}
