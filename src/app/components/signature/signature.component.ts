import {
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
  styleUrls: [
    './signature.component.scss',
  ],
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

  @Input('signature')
  public initialValue: string;

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

  public get svg(): string {
    const code = toSVG(this.canvas, this.signaturePad)
      .split(',')[1];

    return atob(code);
  }

  public set value(value: any) {
    if (this._onChange) {
      this._onChange(value);
    }

    this.changed.emit(value);
  }

  public ngOnInit(): void {
    this._updateDimensions();
    this._initSignaturePad();
    this._listenResize();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.maxWidth && changes.width.previousValue !== changes.width.currentValue) {
      this._updateDimensions();
    }

    if (changes.heightRatio && changes.height.previousValue !== changes.height.currentValue) {
      this._updateDimensions();
    }
  }

  public ngOnDestroy(): void {
    this.signaturePad.off();
  }

  public writeValue(value: string) {
    if (isValidUrl(value)) {
      this.initialValue = value;
    } else if (value !== null) {
      console.error('Signature Pad value must be URL');
    }
  }

  public clear(): void {
    this.initialValue = null;
    this.signaturePad.clear();
    this.value = null;
  }

  public _getParentWidth(el, width): number {
    if (el.offsetWidth) {
      return el.offsetWidth;
    }

    return this._getParentWidth(el.parentElement, width);
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
          this._updateDimensions();
          this._cdRef.markForCheck();
        });
    });
  }

  private _updateDimensions(): void {
    const parentWidth = this._getParentWidth(this._el.nativeElement, 0);

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

  private _initSignaturePad(): void {
    this.canvas.width = this.width;
    this.canvas.height = this.width;

    this.signaturePad = new SignaturePadNative.default(this.canvas, {
      onEnd: () => {
        this.value = this.svg;
      },
    });
  }
}
