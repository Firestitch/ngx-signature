import { Component, ViewChild } from '@angular/core';
import { FsSignatureInputComponent } from '@firestitch/package';
import { downloadFile } from 'playground/app/helpers';


@Component({
  selector: 'app-signature-type',
  templateUrl: './signature-type.component.html',
  styleUrls: ['signature-type.component.scss'],
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
