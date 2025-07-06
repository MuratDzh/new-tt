import { Pipe, PipeTransform } from '@angular/core';

import { environment } from '../../../../shared/src/lib/data/environments/environment';

@Pipe({
  name: 'img',
  standalone: true,
})
export class ImgPipe implements PipeTransform {
  transform(value: string | null): string | null {
    if (value === null) return null;
    const url = environment.url + value;
    return url;
  }
}
