import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MessagesService } from '../../services/messages.service';
import { ToastModule } from 'primeng/toast';
import { LoginService } from '../../services/login.service';
import { CashOutlayService } from '../../services/cash-outlay.service';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { PaginatorModule } from 'primeng/paginator';
import { environment } from '../../../environments/environment';
import { UsuarioService } from '../../services/usuario.service';
import { DropdownModule } from 'primeng/dropdown';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-cash-outlay',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    CardModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    ToastModule,
    CalendarModule,
    PaginatorModule,
    DropdownModule
  ],
  templateUrl: './cash-outlay.component.html',
  styleUrl: './cash-outlay.component.css'
})
export class CashOutlayComponent implements OnInit {

  cashInDialog: boolean = false;

  monto?: number;

  asignadoA?: string = '';

  cashIncomes: any = [];

  desde: Date | undefined;

  hasta: Date | undefined;

  isButtonsActive: boolean = false;

  first: number = 0;

  rows: number = 5;

  page!: number;

  totalRegisters?: number;

  adminUsers: any;

  private messagesService = inject(MessagesService);
  private loginService = inject(LoginService);
  private cashOutlayService = inject(CashOutlayService);
  private usuarioService = inject(UsuarioService);

  ngOnInit() {
    this.getAllCashOutlays(0);
    this.getActiveAdminUsers();
  }

  showDialog() {
    this.cashInDialog = true;
  }

  onPageChange(event: PageEvent | any) {
    this.getAllCashOutlays(event.page);
  }

  formatDate(date: Date) {
    let dayString = `${date.getDate()}`;
    dayString = (dayString.length === 1) ? `0${dayString}` : dayString;

    let monthString = `${date.getMonth() + 1}`;
    monthString = (monthString.length === 1) ? `0${monthString}` : monthString;

    let yearString = `${date.getFullYear()}`;

    return `${yearString}-${monthString}-${dayString}`;
  }

  getAllCashOutlays(page: number) {
    this.page = page;
    this.cashOutlayService.findAllCashIn(page).subscribe(({ cash_in, count }: any) => {
      this.cashIncomes = cash_in;
      this.totalRegisters = count;
    }, (err) => {
      this.messagesService.showInfo(err.error.message);
    });
  }

  saveCashIn() {
    if (!this.monto) {
      this.messagesService.showError('No ha ingresado un monto válido');
      return;
    }

    if(this.asignadoA === '') {
      this.messagesService.showError('No ha seleccionado el usuario al que se le va a asignar el monto');
      return;
    }

    const body = {
      monto: this.monto,
      tipo: 'CASH_IN',
      user_id: this.loginService.usuario._id,
      asignado_a: this.asignadoA
    };

    this.cashOutlayService.saveNewCashIn(body).subscribe((resp: any) => {
      this.messagesService.showSuccess(resp.message);
      this.cashInDialog = false;
      this.monto = undefined;
      this.getAllCashOutlays(this.page);
    }, (err) => {
      this.messagesService.showError(err.error.message);
    });
  }


  search() {
    if (!this.desde || !this.hasta) {
      this.messagesService.showWarning('Ambas fechas son requeridas para la búsqueda');
      return;
    }

    this.hasta.setDate(this.hasta.getDate() + 1);

    const desdeString = this.formatDate(this.desde);
    const hastaString = this.formatDate(this.hasta);

    this.cashOutlayService.findByDateRange(desdeString, hastaString).subscribe(({ cash_outlays }: any) => {
      if (cash_outlays.length === 0) {
        this.messagesService.showInfo('No hay datos encontrados en ese rango de fechas');
        return;
      }

      this.isButtonsActive = true;
      this.cashIncomes = cash_outlays;

    }, (err) => {
      this.messagesService.showError(err.error.message);
    });
  }

  clearFilters() {
    this.isButtonsActive = false;
    this.desde = undefined;
    this.hasta = undefined;
    this.getAllCashOutlays(this.page);
  }

  downloadExcelReport() {
    if (!this.desde || !this.hasta) {
      this.messagesService.showWarning('Ambas fechas son requeridas para generar el reporte');
      return;
    }

    const desdeString = this.formatDate(this.desde);
    const hastaString = this.formatDate(this.hasta);

    const url = `${environment.base_url}/cash-outlay-excel-report?desde=${desdeString}&hasta=${hastaString}`;
    window.open(url, '_blank');

  }

  updateFront() {
    this.clearFilters();
  }

  getActiveAdminUsers() {
    this.usuarioService.getActiveAdminUsers().subscribe(({usuarios}: any) => {
      this.adminUsers = usuarios;
    }, (err) => {
      this.messagesService.showError(err.error.message);
    });
  }
}
