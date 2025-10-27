import { Component, ViewChild } from '@angular/core';
import { FsSignatureInputComponent } from '@firestitch/package';
import { downloadFile } from 'playground/app/helpers';
import { FsSignatureInputComponent as FsSignatureInputComponent_1 } from '../../../../src/app/modules/signature-input/components/signature-input/signature-input.component';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { FsSignaturePreviewComponent } from '../../../../src/app/modules/signature-preview/components/signature-preview/signature-preview.component';
import { MatButton } from '@angular/material/button';


@Component({
    selector: 'app-signature-type',
    templateUrl: './signature-type.component.html',
    styleUrls: ['signature-type.component.scss'],
    standalone: true,
    imports: [
        FsSignatureInputComponent_1,
        FormsModule,
        FsFormModule,
        FsSignaturePreviewComponent,
        MatButton,
    ],
})
export class SignatureTypeComponent {

  @ViewChild(FsSignatureInputComponent)
  public signatureInput: FsSignatureInputComponent;

  public name = 'John Doe';
  public signature = '';

  public downloadPng() {
    this.signatureInput.pngFile({ width: 1000 })
      .subscribe((file: File) => {
        downloadFile(file);
      });    
  }

  public downloadSvg() {
    this.signatureInput.svgFile({ width: 1000 })
      .subscribe((file: File) => {
        downloadFile(file);
      });    
  }

}
