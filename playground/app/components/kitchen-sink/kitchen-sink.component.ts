import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { KitchenSinkConfigureComponent } from '../kitchen-sink-configure';
import { FsExampleComponent } from '@firestitch/example';
import { FsMessage } from '@firestitch/message';
import { FsSignatureComponent } from '@firestitch/package';
import { downloadFile } from 'playground/app/helpers';

@Component({
  selector: 'kitchen-sink',
  templateUrl: 'kitchen-sink.component.html',
  styleUrls: ['kitchen-sink.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    exampleComponent.setConfigureComponent(KitchenSinkConfigureComponent, { config: this.config });
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
