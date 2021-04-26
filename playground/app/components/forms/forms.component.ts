import { Component } from '@angular/core';
import { KitchenSinkConfigureComponent } from '../kitchen-sink-configure';
import { FsExampleComponent } from '@firestitch/example';
import { FsMessage } from '@firestitch/message';

@Component({
  selector: 'forms',
  templateUrl: 'forms.component.html',
  styleUrls: ['forms.component.scss']
})
export class FormsComponent {

  public config = {};
  public value = 'https://firestitch-dev.s3.amazonaws.com/pub/fv/file/01b9cc58b1453f43b0fe5fcf96263be1_1619422445.svg';

  constructor(private exampleComponent: FsExampleComponent,
              private message: FsMessage) {
    exampleComponent.setConfigureComponent(KitchenSinkConfigureComponent, { config: this.config });
  }
}
