import { DatePipe } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ttDate',
  standalone: true,
})
export class TtDatePipe implements PipeTransform {
  datePipe = inject(DatePipe);

  transform(
    value: string | number | Date,
    ...args: unknown[]
  ): string | number {
    let currentDay: Date | number = new Date();
    // console.log('currentDay', currentDay);
    // console.log('Value', new Date(value));
    const offset = currentDay.getTimezoneOffset();

    currentDay = currentDay.getTime() + offset * 60 * 1000;

    // console.log('offset', offset);

    

    // console.log('value.getTime()', value);

    const transformCurrentDayToYear = this.datePipe.transform(currentDay, 'YYYY');
    const transformDateDayToYear = this.datePipe.transform(value, 'YYYY');
    const transformCurrentDayToMonth = this.datePipe.transform(currentDay, 'MM');
    const transformDateDayToMonth = this.datePipe.transform(value, 'MM');
    const transformCurrentDayToDays = this.datePipe.transform(currentDay, 'dd');
    const transformDateDayToDays = this.datePipe.transform(value, 'dd');
    const transformCurrentDayToHours = this.datePipe.transform(currentDay, 'hh');
    const transformDateDayToHours = this.datePipe.transform(value, 'hh', 'en');

    // console.log('transformCurrentDayToDay', transformCurrentDayToDays);
    // console.log('transformDateDayToDay', transformDateDayToDays);
    console.log('-|-|-', transformCurrentDayToHours, transformDateDayToHours);

    const transformCurrentDayToMinuts = this.datePipe.transform(currentDay, 'mm');
    const transformDateDayToMinuts = this.datePipe.transform(value, 'mm');

    const amountYear =
      Number(transformCurrentDayToYear) - Number(transformDateDayToYear);
    const amountMonth =
      Number(transformCurrentDayToMonth) - Number(transformDateDayToMonth);
    const amountDays =
      Number(transformCurrentDayToDays) == Number(transformDateDayToDays)
        ? 0
        : Number(transformCurrentDayToDays) > Number(transformDateDayToDays)
        ? Number(transformCurrentDayToDays) - Number(transformDateDayToDays)
        : 30 -
          Number(transformDateDayToDays) +
          Number(transformCurrentDayToDays);
    const amountHours =
      Number(transformCurrentDayToHours) - Number(transformDateDayToHours);
    const amountMinuts =
      Number(transformCurrentDayToMinuts) - Number(transformDateDayToMinuts);
    return amountYear > 0
      ? 'в прошлом году'
      : amountMonth > 4
      ? `${amountMonth} месяцев назад`
      : amountMonth > 1
      ? `${amountMonth} месяца назад`
      : amountMonth == 1 && amountDays > 30
      ? ` месяц назад`
      : amountDays > 4
      ? `${amountDays} дней назад`
      : amountDays > 1
      ? `${amountDays} дня назад`
      : amountDays == 1
      ? 'день назад'
      : amountHours > 21
      ? `${amountHours} часа назад`
      : amountHours == 21
      ? '21 час назад'
      : amountHours > 4
      ? `${amountHours} часов назад`
      : amountHours > 1
      ? `${amountHours} часа назад`
      : amountHours == 1
      ? 'час назад'
      : amountMinuts == 51 ||
        amountMinuts == 41 ||
        amountMinuts == 31 ||
        amountMinuts == 21
      ? `${amountMinuts} минуту назад`
      : amountMinuts == 54 ||
        amountMinuts == 44 ||
        amountMinuts == 34 ||
        amountMinuts == 24 ||
        (amountMinuts < 5 && amountMinuts !== 1)
      ? `${amountMinuts} минуты назад`
      : amountMinuts == 1
      ? 'минуту назад'
      : `${amountMinuts} минут назад`;
  }
}
