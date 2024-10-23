import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CashOutlayService {

  constructor(
    private http: HttpClient
  ) { }

  findAll(page: number) {
    return this.http.get(`${environment.base_url}/cash-outlay?p=${page}`);
  }
  
  findAllCashIn(page: number) {
    return this.http.get(`${environment.base_url}/cash-in?p=${page}`);
  }

  findByDateRange(desde: string, hasta: string) {
    return this.http.get(`${environment.base_url}/cash-outlay-filters?desde=${desde}&hasta=${hasta}`);
  }

  saveNewCashIn(body: any) {
    return this.http.post(`${environment.base_url}/cash-outlay`, body);
  }

  findLastCashOutlay(asignadoA: string) {
    return this.http.get(`${environment.base_url}/last-cashin-cashout?asignadoA=${asignadoA}`);
  }
}
