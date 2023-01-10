import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

export interface Log {
  title?: string;
  type: 'next' | 'error' | 'complete' | 'subscribe' | 'unsubscribe';
  value?: unknown;
}

@Component({
  selector: 'zen-logger',
  templateUrl: './logger.component.html',
})
export class LoggerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('tableTmp') tableTmp!: ElementRef<HTMLTableElement>;
  @ViewChild('containerTmp') containerTmp!: ElementRef<HTMLDivElement>;
  @Input() logs: Log[] = [];
  @Input() height = '600px';
  #resizeOb!: ResizeObserver;

  ngAfterViewInit() {
    this.#resizeOb = new ResizeObserver(entries => {
      this.containerTmp.nativeElement.scrollTop = entries[0].contentRect.height;
    });

    this.#resizeOb.observe(this.tableTmp.nativeElement);
  }

  ngOnDestroy() {
    if (this.#resizeOb) this.#resizeOb.disconnect();
  }
}
