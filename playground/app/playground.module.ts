import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';


import { FsExampleModule } from '@firestitch/example';
import { FsFormModule } from '@firestitch/form';
import { FsLabelModule } from '@firestitch/label';
import { FsMessageModule } from '@firestitch/message';
import { FsSignatureInputModule, FsSignatureModule, FsSignaturePreviewModule } from '@firestitch/package';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FsSignatureFieldModule } from 'src/app/modules/signature-field/fs-signature-field.module';

import { AppComponent } from './app.component';
import {
  ExamplesComponent,
  KitchenSinkComponent,
  ReadonlyComponent,
  SvgComponent,
} from './components';
import { FormsComponent } from './components/forms/forms.component';
import { KitchenSinkConfigureComponent } from './components/kitchen-sink-configure';
import { SignatureTypeComponent } from './components/signature-type';
import { AppMaterialModule } from './material.module';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    FsSignatureModule,
    FsSignatureInputModule,
    FsSignatureFieldModule,
    FsSignaturePreviewModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsLabelModule,
    FsExampleModule.forRoot(),
    FsMessageModule.forRoot(),
    RouterModule.forRoot(routes, {}),
    FsFormModule,
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    KitchenSinkComponent,
    KitchenSinkConfigureComponent,
    FormsComponent,
    ReadonlyComponent,
    SvgComponent,
    SignatureTypeComponent,
  ],
})
export class PlaygroundModule {
}
