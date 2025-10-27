import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

import { guid } from '@firestitch/common';

import { Observable } from 'rxjs';

import { FsSignatureComponent } from '../../../signature';
import { FsLabelModule } from '@firestitch/label';
import { FsSignatureComponent as FsSignatureComponent_1 } from '../../../signature/components/signature/signature.component';


@Component({
    selector: 'fs-signature-field',
    templateUrl: './signature-field.component.html',
    styleUrls: ['./signature-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FsSignatureFieldComponent),
            multi: true,
        },
    ],
    standalone: true,
    imports: [
        FsLabelModule,
        FsSignatureComponent_1,
        FormsModule,
    ],
})
export class FsSignatureFieldComponent implements ControlValueAccessor {

  @ViewChild(FsSignatureComponent)
  public signatureComponent: FsSignatureComponent;

  @Input()
  public maxWidth: string | number = '450px';

  @Input()
  public minHeight = 150;

  @Input()
  public heightRatio = .5;

  @Input()
  public width: number = 450;

  @Input()
  public hint: string;

  @Input()
  public required: boolean;

  @Input()
  public label = 'Your Signature';

  @Input()
  public readonly: boolean;

  public guid = guid();
  public value: string | File | Blob;

  private _onChange: (_: any) => void;
  private _onTouched: (_: any) => void;

  public get svgFile(): Observable<File> {
    return this.signatureComponent.svgFile;
  }

  public get svgBase64(): string {
    return this.signatureComponent.svgBase64;
  }

  public get pngFile(): Observable<File> {
    return this.signatureComponent.pngFile;
  }

  public changed() {
    this._onChange(this.value);
  }

  public writeValue(value: string | File | Blob) {
    this.value = value;
  }

  public clear(): void {
    this.signatureComponent.clear();
  }

  public registerOnChange(fn: any) {
    this._onChange = fn;
  }

  public registerOnTouched(fn: any) {
    this._onTouched = fn;
  }

}
