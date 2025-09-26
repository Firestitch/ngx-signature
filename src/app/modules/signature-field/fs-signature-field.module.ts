import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FsLabelModule } from '@firestitch/label';

import { FsSignatureModule } from '../signature';

import { FsSignatureFieldComponent } from './components/signature-field';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatIconModule,
    MatButtonModule,
    MatTooltipModule,

    FsLabelModule,
    FsSignatureModule,
  ],
  declarations: [
    FsSignatureFieldComponent,
  ],
  exports: [
    FsSignatureFieldComponent,
  ],
})
export class FsSignatureFieldModule {}
