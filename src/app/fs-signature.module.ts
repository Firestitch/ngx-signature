import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { FsSignatureComponent } from './components/signature/signature.component';


@NgModule({
  imports: [
    CommonModule,

    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    FsSignatureComponent,
  ],
  declarations: [
    FsSignatureComponent,
  ],
  providers: [],
})
export class FsSignatureModule {}
