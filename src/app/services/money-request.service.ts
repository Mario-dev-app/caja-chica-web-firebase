import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MoneyRequestService {

  constructor(
    private http: HttpClient
  ) { }

  getMoneyRequests(page: number, caja: string) {
    return this.http.get(`${environment.base_url}/money-requests?p=${page}&caja=${caja}`);
  }

  updateMoneyRequestStatus(id: string, estado: string, user_id?: string, monto?: number, sobrante?: number, faltante?: number) {
    return this.http.put(`${environment.base_url}/money-request/${id}`, { estado, user_id, money_req_monto: monto, sobrante, faltante });
  }

  getMoneyRequestsByFilter(desde: string, hasta: string, usuario: string) {
    return this.http.get(`${environment.base_url}/money-requests-filters?desde=${desde}&hasta=${hasta}&usuario=${usuario}`);
  }
}
