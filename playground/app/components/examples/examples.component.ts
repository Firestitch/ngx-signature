import { Component } from '@angular/core';
import { environment } from '@env';
import { FsExampleModule } from '@firestitch/example';
import { KitchenSinkComponent } from '../kitchen-sink/kitchen-sink.component';
import { FormsComponent } from '../forms/forms.component';
import { ReadonlyComponent } from '../readonly/readonly.component';
import { SvgComponent } from '../svg/svg.component';
import { SignatureTypeComponent } from '../signature-type/signature-type.component';


@Component({
    templateUrl: 'examples.component.html',
    standalone: true,
    imports: [FsExampleModule, KitchenSinkComponent, FormsComponent, ReadonlyComponent, SvgComponent, SignatureTypeComponent]
})
export class ExamplesComponent {
  public config = environment;
}
