import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
    selector: 'fs-signature-preview',
    templateUrl: './signature-preview.component.html',
    styleUrls: ['./signature-preview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class FsSignaturePreviewComponent {
  private _domSanitizer = inject(DomSanitizer);


  @ViewChild('styleContainer', { static: true })
  public styleContainer: ElementRef;

  @Input() width = 350;

  @Input() public set signature(value) {
    this.svg = null;
    this.image = null;
    
    if(value) {
      if(String(value).match(/^http/) || String(value).match(/^data:image/)) {
        this.image = value;
      } else {
        this.svg = this._domSanitizer.bypassSecurityTrustHtml(value);
      }
    }
  };

  public svg;
  public image;
  public style;
  
}
