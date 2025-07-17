import { Pipe, PipeTransform } from '@angular/core';

import { environment } from '@tt/shared';

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
