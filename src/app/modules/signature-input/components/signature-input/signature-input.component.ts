import {
  Component, ChangeDetectionStrategy, 
  ViewChild, ElementRef, Input, Optional, EventEmitter, Output,
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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
export class FsSignatureInputComponent {

  @ViewChild('svgContainer', { static: true })
  public svgContainer: ElementRef;

  @Input() public width = 350;
  @Input() public required;
  @Input() public height = 50;
  @Input() public fontSize = 45;
  @Input() public fontFamily = 'Allura';
  @Input() public placeholder = 'Your name';

  @Output() public changed = new EventEmitter<string>();

  public svg;
  public name;
  public style;
  
  public svgFile(options: { width?: number, height?: number } = {}): Observable<File> {
    return this.svgBase64(options)
      .pipe(
        switchMap((base64) => {
          return from(fetch(`data:image/svg+xml;base64,${base64}`));
        }),
        switchMap((res) => {
          return from(res.blob());
        }),
        map((blob) => {
          return new File([blob], 'signature.svg', { type: "image/svg+xml" })
        })
    );
  }
  
  public svgBase64(options: { width?: number, height?: number } = {}): Observable<string> {
    const { width, height, scale } = this._calculateOptions(options);

    return this.renderSvg(width, height, this.fontSize * scale, true)
      .pipe(
        map((svg) => {
          return window.btoa(svg);
        })
      )
  }
  
  public pngFile(options: { width?: number, height?: number } = {}): Observable<File> {
    const { width, height } = this._calculateOptions(options);

    return this.svgBase64(options)
      .pipe(
        switchMap((base64) => {
          return new Observable<File>((observer) => {
            let img = document.createElement('img');
            img.onload = () => {
              document.body.appendChild(img);
              let canvas = document.createElement('canvas');
              document.body.removeChild(img);
              canvas.width = width;
              canvas.height = height;
              let ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              
              try {
                canvas.toBlob((blob) => {
                  observer.next(new File([blob], 'signature.png', { type: 'image/png' }));
                  observer.complete();
                });
              } catch (e) {
                observer.error(null);
              }
            };
      
            img.onerror = () => {
              observer.error(null);
            };
      
            img.src = `data:image/svg+xml;base64,${base64}`;
          });
        })
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
          if(!embedFonts) {
            return of(`@import url('https://fonts.googleapis.com/css?family=${this.fontFamily}')`);
          }

          return base64Font(this.fontFamily);
        }),
        switchMap((fontStyle) => {
          this.svgContainer.nativeElement.innerHTML = `
          <svg
              xmlns="http://www.w3.org/2000/svg"
              height="${height}"
              width="${width}"
              data-font-family="${this.fontFamily}"      
              data-font-size="${fontSize}"
              data-font-name="${this.name}">
            <defs>
              <style>${fontStyle}</style>
            </defs>
            <text 
                x="50%" 
                y="50%"
                style="text-anchor: middle; dominant-baseline: central; font-family: ${this.fontFamily}; font-size: ${fontSize}px;">
              ${this.name}
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
