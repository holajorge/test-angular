import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// import { BrowserModule } from '@angular/platform-browser';
import { NgxSpinnerModule } from 'ngx-spinner';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';

import { CorporativosRoutingModule } from './corporativos-routing.module';
import { CorporativosComponent } from './corporativos.component';
import { DetalleComponent } from './detalle/detalle.component';

@NgModule({
  declarations: [CorporativosComponent, DetalleComponent],
  imports: [
    CommonModule,
    CorporativosRoutingModule,
    NgxDatatableModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgbPaginationModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CorporativosModule { }
