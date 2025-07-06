import { DatePipe } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'messagrGroupDate',
  standalone: true,
  
})
export class MessagrGroupDatePipe implements PipeTransform {
  datePipe=inject(DatePipe)
  transform(value: string, ...args: unknown[]): unknown {
    let currentDay: Date|number = new Date()
    let offset = currentDay.getTimezoneOffset()
    currentDay = currentDay.getTime() + offset * 60 * 1000;

    // let messageDate = (new Date(value)).getTime()

    let transformCurrentDayToYear = this.datePipe.transform(currentDay, 'YYYY');
    let transformDateDayToYear = this.datePipe.transform(value, 'YYYY');
    let transformCurrentDayToMonth = this.datePipe.transform(currentDay, 'MM');
    let transformDateDayToMonth = this.datePipe.transform(value, 'MM');
    let transformCurrentDayToDays = this.datePipe.transform(currentDay, 'dd');
    let transformDateDayToDays = this.datePipe.transform(value, 'dd');
    
    let amountYear =
      Number(transformCurrentDayToYear) - Number(transformDateDayToYear);
    let amountMonth =
      Number(transformCurrentDayToMonth) - Number(transformDateDayToMonth);
    let amountDays =
    Number(transformCurrentDayToDays) == Number(transformDateDayToDays)
      ? 0
      : Number(transformCurrentDayToDays) > Number(transformDateDayToDays)
      ? Number(transformCurrentDayToDays) - Number(transformDateDayToDays)
      : 30 -
        Number(transformDateDayToDays) +
        Number(transformCurrentDayToDays);

    return amountYear > 0 ?
      this.datePipe.transform(value, 'dd MMMM YYYY')
      :
      amountDays == 0 ?
      'сегодня'
      : amountDays == 1 ?
        "вчера"
        : amountDays == 2 ?
          "позавчера"
          : amountDays == 3 ||
          amountDays == 4 ?
            `${amountDays} дня назад`
            : amountDays < 7 ?
              `${amountDays} дней назад`
              : amountDays == 7 ?
                "неделю назад"
                  : this.datePipe.transform(value, 'dd MMMM')
  }
}
