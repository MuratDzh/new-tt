import { Pipe, PipeTransform } from '@angular/core';
import { Profile } from '@tt/interfaces/profile';




@Pipe({
  name: 'subscribersSlice',
  standalone: true,
})
export class SlicePipe implements PipeTransform {
  transform(value: Profile[] | null, args: number): Profile[]|undefined|null {
    if (value !== null) {
      return value.slice(0, args);
    }

    return value
  }
}
