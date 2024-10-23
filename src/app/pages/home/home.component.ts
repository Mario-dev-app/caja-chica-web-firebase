import { Component, OnInit, inject } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { MoneyRequestService } from '../../services/money-request.service';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { MessagesService } from '../../services/messages.service';
import { LoginService } from '../../services/login.service';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CashOutlayService } from '../../services/cash-outlay.service';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TableModule,
    CardModule,
    ToastModule,
    PaginatorModule,
    CommonModule,
    ButtonModule,
    ConfirmDialogModule,
    CalendarModule,
    InputTextModule,
    NavbarComponent,
    DialogModule,
    RadioButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [ConfirmationService]
})
export class HomeComponent implements OnInit {

  balance!: number;

  data: any;

  options: any;

  moneyRequests: any = [];

  totalRegistros?: number;

  first: number = 0;

  rows: number = 5;

  page!: number;

  desde!: Date | undefined;
  hasta!: Date | undefined;
  usuario: string | undefined;

  showPaginator!: boolean;

  sobranteFaltanteDialogVisible: boolean = false;

  sobranteFaltanteTipo?: string;
  sobranteFaltanteMonto?: number;

  renderDialogVisible: boolean = false;

  detailsDialogVisible: boolean = false;

  idToRender!: string;

  isClearActive: boolean = false;

  detailToShow: any;

  userLoggedId!: string;

  private moneyRequestService = inject(MoneyRequestService);
  private messagesService = inject(MessagesService);
  private loginService = inject(LoginService);
  private cashOutlayService = inject(CashOutlayService);

  constructor(
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.userLoggedId = this.loginService.usuario._id;
    this.getMoneyRequests(0);
    this.findLastCashOutlay();
  }

  findLastCashOutlay() {
    this.cashOutlayService.findLastCashOutlay(this.userLoggedId).subscribe(({ last_cash_outlay }: any) => {
      if(last_cash_outlay) {
        this.balance = last_cash_outlay.balance;
      }else {
        this.balance = 0;
      }
    }, (err) => {
      this.messagesService.showError(err.error.message);
    });
  }

  getMoneyRequests(page: number) {
    this.showPaginator = true;
    this.page = page;
    this.moneyRequestService.getMoneyRequests(page, this.userLoggedId).subscribe((resp: any) => {
      this.moneyRequests = resp.money_requests;
      this.totalRegistros = resp.count;
    }, (err) => {
      this.messagesService.showError(err.error.message);
    });
  }

  onPageChange(event: PageEvent | any) {
    this.getMoneyRequests(event.page);
  }

  showConfirmationDialog(message: string, header: string, accept: Function) {
    this.confirmationService.confirm({
      message,
      header,
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text p-button-secondary",
      accept,
      reject: () => {
        this.messagesService.showInfo('No se realizó ningún cambio');
      }
    });
  }

  payout(id: string, monto: number) {
    const accept = () => {
      this.moneyRequestService.updateMoneyRequestStatus(id, 'DESEMBOLSADO', this.loginService.usuario._id, monto).subscribe((resp) => {
        this.getMoneyRequests(this.page);
        this.findLastCashOutlay();
        this.clearFilters();
        this.messagesService.showSuccess('Dinero desembolsado');
      }, (err) => {
        console.log(err);
        this.messagesService.showError(err.error.message);
      });
    };
    this.showConfirmationDialog('¿Está seguro de desembolsar?', 'Confirmación', accept);
  }

  render(id: string) {
    this.renderDialogVisible = true;
    this.idToRender = id;
  }

  renderWithoutSobranteFaltante() {
    this.renderDialogVisible = false;
    this.moneyRequestService.updateMoneyRequestStatus(this.idToRender, 'RENDIDO',  this.loginService.usuario._id).subscribe((resp) => {
      this.getMoneyRequests(this.page);
      this.findLastCashOutlay();
      this.messagesService.showSuccess('Se rindió el registro');
    }, (err) => {
      this.messagesService.showError(err.error.message);
    });
  }

  searchWithFilters() {
    if (!this.desde || !this.hasta || !this.usuario) {
      this.messagesService.showWarning('Los tres campos son requeridos para la búsqueda');
      return;
    }

    this.hasta.setDate(this.hasta.getDate() + 1);

    const desdeString = this.formatDate(this.desde);
    const hastaString = this.formatDate(this.hasta);

    this.moneyRequestService.getMoneyRequestsByFilter(desdeString, hastaString, this.usuario.trim()).subscribe(({ money_requests }: any) => {
      if (money_requests.length === 0) {
        this.messagesService.showInfo('No se encontraron registros con los filtros ingresados');
        this.getMoneyRequests(this.page);
        this.findLastCashOutlay();
        return;
      }
      this.isClearActive = true;
      this.showPaginator = false;
      this.moneyRequests = money_requests;
    }, (err) => {
      this.messagesService.showError(err.error.message);
    });

  }

  clearFilters() {
    this.showPaginator = true;
    this.usuario = '';
    this.hasta = undefined;
    this.desde = undefined;
    this.getMoneyRequests(this.page);
    this.findLastCashOutlay();
    this.isClearActive = false;
  }

  formatDate(date: Date) {
    let dayString = `${date.getDate()}`;
    dayString = (dayString.length === 1) ? `0${dayString}` : dayString;

    let monthString = `${date.getMonth() + 1}`;
    monthString = (monthString.length === 1) ? `0${monthString}` : monthString;

    let yearString = `${date.getFullYear()}`;

    return `${yearString}-${monthString}-${dayString}`;
  }

  saveSobranteFaltante() {
    if (!this.sobranteFaltanteTipo || !this.sobranteFaltanteMonto) {
      this.messagesService.showWarning('Es necesario el tipo y monto');
      return;
    }

    if (this.sobranteFaltanteTipo === 'SOBRANTE') {
      this.moneyRequestService.updateMoneyRequestStatus(this.idToRender, 'RENDIDO', this.loginService.usuario._id, undefined, this.sobranteFaltanteMonto, undefined).subscribe((resp) => {
        this.getMoneyRequests(this.page);
        this.findLastCashOutlay();
        this.sobranteFaltanteDialogVisible = false;
        this.sobranteFaltanteMonto = undefined;
        this.sobranteFaltanteTipo = undefined;
        this.messagesService.showSuccess('Se rindió el registro');
      }, (err) => {
        this.messagesService.showError(err.error.message);
      });
    } else {
      this.moneyRequestService.updateMoneyRequestStatus(this.idToRender, 'RENDIDO',  this.loginService.usuario._id, undefined, undefined, this.sobranteFaltanteMonto).subscribe((resp) => {
        this.getMoneyRequests(this.page);
        this.findLastCashOutlay();
        this.sobranteFaltanteDialogVisible = false;
        this.sobranteFaltanteMonto = undefined;
        this.sobranteFaltanteTipo = undefined;
        this.messagesService.showSuccess('Se rindió el registro');
      }, (err) => {
        this.messagesService.showError(err.error.message);
      });
    }
  }

  backgroundColorBalance() {
    if (this.balance < 200) {
      return 'bg-red-500';
    } else if (this.balance < 500) {
      return 'bg-yellow-500';
    } else if(this.balance > 200) {
      return 'bg-teal-500';
    }else {
      return 'bg-primary';
    }
  }

  updateFront() {
    /* this.getMoneyRequests(this.page); */
    this.clearFilters();
  }

  showDetails(id: string) {
    this.detailsDialogVisible = true;
    this.moneyRequests.find((moneyRequest: any) => {
      if(moneyRequest._id === id) {
        this.detailToShow = moneyRequest.details;
      }
    });

    console.log(this.detailToShow);
  }

}
