import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FsSignaturePreviewComponent } from './components';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatFormFieldModule,
    MatInputModule,
  ],
  declarations: [
    FsSignaturePreviewComponent,
  ],
  exports: [
    FsSignaturePreviewComponent,
  ],
})
export class FsSignaturePreviewModule {}
