import { from, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";

export function base64File(base64: string, filename: string, type: string) {
  return of(base64)
  .pipe(
    switchMap((base64) => {
      return from(fetch(`data:${type};base64,${base64}`));
    }),
    switchMap((res) => {
      return from(res.blob());
    }),
    map((blob) => {
      return new File([blob], filename, { type });
    })
  );
}