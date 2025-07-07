import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DADATA_TOKEN} from "./DADATA_TOKEN";
import {map} from "rxjs";
import {DadataSuggestions} from "./dadata.interface";

@Injectable({
  providedIn: 'root'
})
export class DadataService {

  dadataUrl='https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'

  constructor(private http: HttpClient) { }

  getSuggestions(query: string|null){
    return this.http.post<{suggestions:DadataSuggestions[]}>(this.dadataUrl, {query},{
      headers:{
        "Authorization": "Token " + `${DADATA_TOKEN}`
      }
    }).pipe(
    map(v=>v.suggestions)
    )
  }
}
