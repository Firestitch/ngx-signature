import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FsExampleComponent } from '@firestitch/example';
import { FsMessage } from '@firestitch/message';
import { FsSignatureComponent } from '@firestitch/package';
import { downloadFile } from 'playground/app/helpers';
import { FsSignatureComponent as FsSignatureComponent_1 } from '../../../../src/app/modules/signature/components/signature/signature.component';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'kitchen-sink',
    templateUrl: 'kitchen-sink.component.html',
    styleUrls: ['kitchen-sink.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsSignatureComponent_1,
        FormsModule,
        FsFormModule,
        MatButton,
    ],
})
export class KitchenSinkComponent {

  @ViewChild(FsSignatureComponent)
  public signature: FsSignatureComponent;

  public config = {};
  public value = '';

  constructor(
    private exampleComponent: FsExampleComponent,
    private message: FsMessage,
    ) {
  }

  public downloadPng() {
    this.signature.pngFile
      .subscribe((file: File) => {
        downloadFile(file);
      });    
  }

  public downloadSvg() {
    this.signature.svgFile
      .subscribe((file: File) => {
        downloadFile(file);
      });    
  }

}
