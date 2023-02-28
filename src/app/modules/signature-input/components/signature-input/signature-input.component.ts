import {
  Component, ChangeDetectionStrategy, 
  ViewChild, ElementRef, Input, Optional, EventEmitter, Output, OnInit, AfterViewInit,
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { base64File, base64ImageFile } from '../../../../helpers';
import { base64Font } from '../../helpers/base64-font';


@Component({
  selector: 'fs-signature-input',
  templateUrl: './signature-input.component.html',
  styleUrls: ['./signature-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,  
  viewProviders: [
    {
      provide: ControlContainer,
      deps: [[Optional, NgForm]],
      useFactory: (ngForm: NgForm) => ngForm,
    },
  ],
})
export class FsSignatureInputComponent implements OnInit, AfterViewInit {

  @ViewChild('svgContainer', { static: true })
  public svgContainer: ElementRef;

  @ViewChild('styleContainer', { static: true })
  public styleContainer: ElementRef;

  @Input() public width = 350;
  @Input() public required;
  @Input() public height = 50;
  @Input() public fontSize = 45;
  @Input() public fontFamily = 'Allura';
  @Input() public placeholder = 'Your name';
  @Input() public signatureName = '';

  @Output() public changed = new EventEmitter<string>();

  public svg;
  public style;

  public ngOnInit(): void {
    this.styleContainer.nativeElement.innerHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css?family=${this.fontFamily}');
    </style>`;
  }

  public ngAfterViewInit(): void {
    if(this.signatureName) {
      setTimeout(() => {
        this.updateName();
      });
    }
  }
  
  public svgFile(options: { width?: number, height?: number } = {}): Observable<File> {
    return this.svgBase64(options)
      .pipe(
        switchMap((base64) => base64File(base64, 'signature.svg', 'image/svg+xml')),
      );
  }
  
  public svgBase64(options: { width?: number, height?: number } = {}): Observable<string> {
    const { width, height, scale } = this._calculateOptions(options);

    return this.renderSvg(width, height, this.fontSize * scale, true)
      .pipe(
        map((svg) => {
          return window.btoa(svg);
        }),
      );
  }
  
  public pngFile(options: { width?: number, height?: number } = {}): Observable<File> {
    return this.svgBase64(options)
      .pipe(
        switchMap((base64) => {
          return base64ImageFile(base64, 'signature.png', 'png');
        }),
      );
  }

  public get svgEl() {
    return this.svgContainer.nativeElement.children[0];
  }

  public updateName(): void {
    this.renderSvg(this.width, this.height, this.fontSize)
      .subscribe((svg) => {
        this.changed.emit(svg);
      });
  }

  public renderSvg(width, height, fontSize, embedFonts = false): Observable<string> {
    return of(true)
      .pipe(
        switchMap((): Observable<string> => {
          return embedFonts ? base64Font(this.fontFamily, this.signatureName) : of('');
        }),
        switchMap((fontStyle) => {
          this.svgContainer.nativeElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" width="${width}" data-font-family="${this.fontFamily}" data-font-size="${fontSize}" data-font-name="${this.signatureName}">
  <defs>
    <style>
      ${fontStyle}
    </style>
  </defs>
  <text x="50%" y="50%" style="text-anchor: middle; dominant-baseline: central; font-family: ${this.fontFamily}; font-size: ${fontSize}px;">
    ${this.signatureName}
  </text>
</svg>`;
      
          const svg = this.svgEl;
          const bbox = svg.getBBox();
          let viewBox = `0 0 ${width} ${height}`;
      
          if(bbox.width > width) {
            viewBox = `0 0 ${bbox.width} ${bbox.height}`;
          }
      
          svg.setAttribute('viewBox',viewBox);
      
          return of(this.svgContainer.nativeElement.innerHTML); 
        }),
      );
  }

  private _calculateOptions(options): { width: number, height: number, scale: number } {
    let width = this.width;
    let height = this.height;
    let scale = 1;

    if(options.width) {
      width = options.width;
      height = width * (this.height / this.width);
      scale = width / this.width;
    }

    if(options.height) {
      height = options.height;
      width = height * (this.width / this.height);
      scale = height / this.height;
    }

    return { width, height, scale };
  }

}
