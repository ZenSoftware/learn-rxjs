import { Component } from '@angular/core';
import { interval, of, delay, concatMap, mergeMap, share, Subscription } from 'rxjs';
import { Log } from '../logger/logger.component';

@Component({
  selector: 'zen-sample',
  templateUrl: './sample.component.html',
})
export class SampleComponent {
  logs: Log[] = [];
  #shareSource = interval(1000).pipe(share());
  #share1Subscription?: Subscription;
  #share2Subscription?: Subscription;

  /** https://www.learnrxjs.io/learn-rxjs/operators/transformation/concatmap */
  concatMap() {
    this.printSubscribe('concatMap');
    of(2000, 1000)
      .pipe(concatMap(val => of(`delayed ${val}`).pipe(delay(val))))
      .subscribe(this.printer('concatMap'));
  }

  mergeMap() {
    this.printSubscribe('mergeMap');
    of(2000, 1000)
      .pipe(mergeMap(val => of(`delayed ${val}`).pipe(delay(val))))
      .subscribe(this.printer('mergeMap'));
  }

  share1Sub() {
    this.printSubscribe('share1');
    this.#share1Subscription = this.#shareSource.subscribe(this.printer('share1'));
  }

  share2Sub() {
    this.printSubscribe('share2');
    this.#share2Subscription = this.#shareSource.subscribe(this.printer('share2'));
  }

  share1Unsub() {
    this.printUnsubscribe('share1');
    this.#share1Subscription?.unsubscribe();
  }

  share2Unsub() {
    this.printUnsubscribe('share2');
    this.#share2Subscription?.unsubscribe();
  }

  printSubscribe(title?: string) {
    this.logs.push({ title, type: 'subscribe' });
  }

  printUnsubscribe(title?: string) {
    this.logs.push({ title, type: 'unsubscribe' });
  }

  printer(title?: string) {
    return {
      next: (val: any) => this.logs.push({ title, type: 'next', value: val }),
      complete: () => this.logs.push({ title, type: 'complete' }),
      error: (err: any) => this.logs.push({ title, type: 'error', value: err }),
    };
  }

  clear() {
    this.logs = [];
  }
}
