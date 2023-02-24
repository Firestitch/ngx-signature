import { from, Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";

export function base64Font(fontFamily): Observable<string> {
  var url = `https://fonts.googleapis.com/icon?family=${fontFamily}`;

  return fetchCSS(url)
  .pipe(
    switchMap((css) => from(embedFonts(css)))
  )
}

function fetchCSS (url): Observable<any> {
  return from(fetch(url))
    .pipe(
      switchMap((res: Response) => {
        return res.text();
      }),
    );
}

function embedFonts(cssText): Promise<any> {
  var fontLocations = cssText.match(/https:\/\/[^)]+/g)
  var fontLoadedPromises = fontLocations.map(function (location) {
    return new Promise(function (resolve, reject) {
      fetch(location).then(function (res) {
        return res.blob()
      }).then(function (blob) {
        var reader = new FileReader()
        reader.addEventListener('load', function () {
          cssText = cssText.replace(location, this.result)
          resolve([location, this.result])
        })
        reader.readAsDataURL(blob)
      }).catch(reject)
    })
  });

  return Promise.all(fontLoadedPromises)
    .then(() =>  {
      return cssText
    });
}
