import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import * as SignaturePadNative from 'signature_pad';


@Component({
  selector: 'fs-signature',
  templateUrl: './signature.component.html',
  styleUrls: [
    './signature.component.scss',
  ],
})
export class FsSignatureComponent implements OnInit, OnDestroy {

  @Input()
  public width: string | number = 400;

  @Input()
  public height = 200;

  @Input()
  public label = 'Your Signature';

  @Output()
  public changed = new EventEmitter<string>();

  @ViewChild('canvas', { static: true })
  public canvas: ElementRef;

  public signaturePad: SignaturePadNative.default;

  constructor(
    private _el: ElementRef,
  ) {}

  public ngOnInit(): void {
    const match = String(this.width).match(/(\d+)%/);
    if (match) {
      this.width = this._getParentWidth(this._el.nativeElement, Number(match[1]));
    }

    const canvas = this.canvas.nativeElement;
    canvas.width = this.width;
    canvas.height = this.height;

    this._initSignaturePad();
  }

  public ngOnDestroy(): void {
    this.signaturePad.off();
  }

  public clear(): void {
    this.signaturePad.clear();
  }

  private _initSignaturePad(): void {
    this.signaturePad = new SignaturePadNative.default(this.canvas.nativeElement, {
      onEnd: () => {
        this.changed.emit(this.svg);
      },
    });
  }

  public get svg(): string {
    const code = this.signaturePad.toDataURL('image/svg+xml').split(',')[1];

    return atob(code);
  }

  public _getParentWidth(el, width): number {
    if (el.offsetWidth) {
      return (el.offsetWidth * (width/100));
    }

    return this._getParentWidth(el.parentElement, width);
  }
}
