import { Observable } from "rxjs";

export function base64ImageFile(base64: string, filename, extension) {
  return new Observable<File>((observer) => {
    let img = document.createElement('img');
    img.onload = () => {
      document.body.appendChild(img);
      let canvas = document.createElement('canvas');
      document.body.removeChild(img);
      canvas.width = img.width;
      canvas.height = img.height;
      let ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      try {
        canvas.toBlob((blob) => {
          observer.next(new File([blob], filename, { type: `image/${extension}` }));
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
}
