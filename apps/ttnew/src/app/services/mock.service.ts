import { Injectable } from '@angular/core';
import {of} from "rxjs";

 export interface Address{
  city?: string;
  street?: string;
  building?: number|string;
  apartment?: number|string;
}

export interface Feature{
   code: string;
   label: string;
   value: boolean

}

@Injectable({
  providedIn: 'root'
})
export class MockService {


  addresses: Address[]=[
    {
      city: 'Казань',
      street: 'Есенина',
      building: 12,
      apartment: 37
    },
    {
      city: 'Москва',
      street: 'Репина',
      building: 124,
      apartment: 137
    }
  ]

  features: Feature[]=[
    {
      code: 'drivers license',
      label:'Водительские права',
      value: true
    },
    {
      code: 'business trips',
      label:'Готовность к командировкам',
      value: true
    },
    {
      code: 'overtime',
      label:'Готовность к переработкам',
      value: false
    }
  ]

  getAddresses(){
    return of(this.addresses);
  }

  getFeatures(){
    return of(this.features);
  }

}
