import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { FsSignatureFieldComponent } from '../../../../src/app/modules/signature-field/components/signature-field/signature-field.component';
import { MatButton } from '@angular/material/button';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'forms',
    templateUrl: './forms.component.html',
    styleUrls: ['./forms.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        FsFormModule,
        FsSignatureFieldComponent,
        MatButton,
        JsonPipe,
    ],
})
export class FormsComponent {

  public config = {};
  public value = 'https://firestitch-dev.s3.amazonaws.com/pub/fv/file/01b9cc58b1453f43b0fe5fcf96263be1_1619422445.svg';
}
