import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import * as SignaturePadNative from 'signature_pad';
import { isValidUrl } from '../../helpers/is-valid-url';
import { toSVG } from '../../helpers/to-svg';


@Component({
  selector: 'fs-signature',
  templateUrl: './signature.component.html',
  styleUrls: [ './signature.component.scss' ],  
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FsSignatureComponent),
      multi: true
    },
  ]
})
export class FsSignatureComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {

  @Input()
  public maxWidth = '450px';

  @Input()
  public heightRatio = .5;

  @Input()
  public hint: string;

  @Input()
  public label = 'Your Signature';

  @Input()
  get readonly(): boolean {
    return this._readonly;
  }

  set readonly(value: boolean) {
    this._readonly = coerceBooleanProperty(value);
  }

  @Output()
  public changed = new EventEmitter<string>();

  @ViewChild('canvas', { static: true })
  public canvasElRef: ElementRef;

  public signaturePad: SignaturePadNative.default;
  public width: number;
  public height: number;
  public url;

  private _svg;
  private _readonly = false;

  private _onChange: (_: any) => void;
  private _onTouched: (_: any) => void;

  constructor(
    private _el: ElementRef,
    private _cdRef: ChangeDetectorRef,
    private _ngZone: NgZone,
  ) {}

  public get canvas(): HTMLCanvasElement {
    return this.canvasElRef.nativeElement;
  }

  public set svg(value: any) {
    this._svg = value;
    if (this._onChange) {
      this._onChange(value);
    }

    this.changed.emit(value);
  }

  public get svg() {
    return this._svg;
  }

  public ngOnInit(): void {
    this.updateSize();
    this._initSignaturePad();
    this._listenResize();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.maxWidth && changes.maxWidth.previousValue !== changes.maxWidth.currentValue) {
      this.updateSize();
    }

    if (changes.heightRatio && changes.heightRatio.previousValue !== changes.heightRatio.currentValue) {
      this.updateSize();
    }
  }

  public ngOnDestroy(): void {
    this.signaturePad.off();
  }

  public writeValue(value: string) {
    if (isValidUrl(value)) {
      this.url = value;
      this._cdRef.markForCheck();
    }
  }

  public updateSize(): void {
    const parentWidth = this._getParentWidth(this._el.nativeElement);

    const match = String(this.maxWidth).match(/(\d+)(%|px)/);

    if (match) {
      const width = Number(match[1]);
      const maxWidth = match[2] === '%' ? (width / 100) * parentWidth : width;

      this.width = parentWidth > maxWidth ? maxWidth : parentWidth;
      this.height = this.width * this.heightRatio;

      if (this.canvas) {
        this.canvas.height = this.height;
        this.canvas.width = this.width;
      }
    }
  }

  public clear(): void {
    this.url = null;
    this.svg = null;
    this.signaturePad.clear();
  }

  public _getParentWidth(el): number {
    if (!el) {
      return 0;
    }

    if (el.offsetWidth) {
      return el.offsetWidth;
    }

    return this._getParentWidth(el.parentElement);
  }

  public registerOnChange(fn: any) {
    this._onChange = fn;
  }

  public registerOnTouched(fn: any) {
    this._onTouched = fn;
  }

  private _listenResize(): void {
    this._ngZone.run(() => {
      fromEvent(window, 'resize')
        .pipe(
          debounceTime(100),
        )
        .subscribe(() => {
          this.updateSize();
          this._cdRef.markForCheck();
        });
    });
  }

  private _initSignaturePad(): void {
    this.canvas.width = this.width;
    this.canvas.height = this.width;

    // min&max width and dotSize are fixes for SC-T297
    const minWidth = 0.5;
    const maxWidth = 2.5;

    this.signaturePad = new SignaturePadNative.default(this.canvas, {
      onEnd: () => {
        const code = toSVG(this.canvas, this.signaturePad)
            .split(',')[1];
      
        this.svg = atob(code);
      },
      dotSize: function () {
        return (minWidth + maxWidth) / 2;
      }
    });
  }
}
