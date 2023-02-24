import { Component, ViewChild } from '@angular/core';
import { FsSignatureInputComponent } from '@firestitch/package';


@Component({
  selector: 'app-signature-type',
  templateUrl: './signature-type.component.html',
  styleUrls: ['signature-type.component.scss']
})
export class SignatureTypeComponent {

  @ViewChild(FsSignatureInputComponent)
  public signatureInput: FsSignatureInputComponent;

  public name = 'John Doe';
  public signature = 'https://firestitch-dev.s3.amazonaws.com/pub/fv/file/01b9cc58b1453f43b0fe5fcf96263be1_1619422445.svg';

  public downloadPng() {
    this.signatureInput.pngFile({ width: 1000 })
      .subscribe((file: File) => {
        const link = document.createElement('a');
        link.setAttribute('download', file.name);
        link.href = URL.createObjectURL(file)
        document.body.appendChild(link);
        link.click();
        link.remove();
      });    
  }

  public downloadSvg() {
    this.signatureInput.svgFile({ width: 1000 })
      .subscribe((file: File) => {
        const link = document.createElement('a');
        link.setAttribute('download', file.name);
        link.href = URL.createObjectURL(file)
        document.body.appendChild(link);
        link.click();
        link.remove();
      });    
  }

}
