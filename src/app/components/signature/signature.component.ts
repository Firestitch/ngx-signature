import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { coerceBooleanProperty } from '@angular/cdk/coercion';

import * as SignaturePadNative from 'signature_pad';
import { isValidUrl } from '../../helpers/is-valid-url';


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
  public width: number | string;

  @Input()
  public height: number | string;

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

  private _canvasWidth = 400;
  private _canvasHeight = 200;

  private _readonly = false;

  private _onChange: (_: any) => void;
  private _onTouched: (_: any) => void;

  constructor(
    private _el: ElementRef,
  ) {}

  public get canvas(): HTMLCanvasElement {
    return this.canvasElRef.nativeElement;
  }

  public get canvasContext(): CanvasRenderingContext2D | null {
    return this.canvas.getContext('2d');
  }

  public get canvasWidth(): number {
    return this._canvasWidth;
  }

  public get canvasHeight(): number {
    return this._canvasHeight;
  }

  public get svg(): string {
    const code = this.signaturePad.toDataURL('image/svg+xml').split(',')[1];

    return atob(code);
  }

  public set value(value: any) {
    if (this._onChange) {
      this._onChange(value);
    }

    this.changed.emit(value);
  }

  public ngOnInit(): void {
    this._initSignaturePad();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.width && changes.width.previousValue !== changes.width.currentValue) {
      this._setCanvasWidth(this.width);
    }

    if (changes.height && changes.height.previousValue !== changes.height.currentValue) {
      this._setCanvasHeight(this.height);
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
      return (el.offsetWidth * (width / 100));
    }

    return this._getParentWidth(el.parentElement, width);
  }

  public registerOnChange(fn: any) {
    this._onChange = fn;
  }

  public registerOnTouched(fn: any) {
    this._onTouched = fn;
  }

  private _setCanvasWidth(value: string | number) {
    const match = String(value).match(/(\d+)%/);

    if (match) {
      this._canvasWidth = this._getParentWidth(this._el.nativeElement, Number(match[1]));
    } else if (typeof value === 'string') {
      this._canvasWidth = parseInt(value, 10);
    } else {
      this._canvasWidth = value;
    }

    if (this.canvas) {
      this.canvas.width = this.canvasWidth;
    }
  }

  private _setCanvasHeight(value: string | number) {
    if (typeof value === 'string') {
      this._canvasHeight = parseInt(value, 10);
    } else {
      this._canvasHeight = value;
    }

    if (this.canvas) {
      this.canvas.height = this.canvasHeight;
    }
  }

  private _initSignaturePad(): void {
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;

    this.signaturePad = new SignaturePadNative.default(this.canvasElRef.nativeElement, {
      onEnd: () => {
        this.value = this.svg;
      },
    });
  }
}
