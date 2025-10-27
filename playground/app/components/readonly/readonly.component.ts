import { Component } from '@angular/core';
import { FsSignatureComponent } from '../../../../src/app/modules/signature/components/signature/signature.component';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';

@Component({
    selector: 'readonly',
    templateUrl: './readonly.component.html',
    styleUrls: ['readonly.component.scss'],
    standalone: true,
    imports: [FsSignatureComponent, FormsModule, FsFormModule]
})
export class ReadonlyComponent {

  public config = {};
  public value = 'https://firestitch-dev.s3.amazonaws.com/pub/fv/file/01b9cc58b1453f43b0fe5fcf96263be1_1619422445.svg';
}
