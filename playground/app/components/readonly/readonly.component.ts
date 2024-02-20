import { Component } from '@angular/core';

@Component({
  selector: 'readonly',
  templateUrl: './readonly.component.html',
  styleUrls: ['readonly.component.scss']
})
export class ReadonlyComponent {

  public config = {};
  public value = 'https://firestitch-dev.s3.amazonaws.com/pub/fv/file/01b9cc58b1453f43b0fe5fcf96263be1_1619422445.svg';
}
