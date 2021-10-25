import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatatableComponent, ColumnMode } from "@swimlane/ngx-datatable";
import { CorporativosService } from 'app/shared/corporativos/corporativos.service';
import Swal from "sweetalert2";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-corporativos',
  templateUrl: './corporativos.component.html',
  styleUrls: ['./corporativos.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class CorporativosComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  rows:any = [];
  public ColumnMode = ColumnMode;
  public limitRef = 10;

  // column header
  public columns = [
    
    { name: "nombre", prop: "S_DBName" },
    { name: "url", prop: "S_SystemURL" },
    { name: "fechaIncorporacion", prop: "D_FechaIncorporacion" },
    { name: "creado", prop: "created_at" },
    { name: "nombreAsignado", prop: "asignado.S_Nombre" },
    { name: "status", prop: "S_Activo" },
    { name: "Actiones", prop: "Actions" },
    
  ];

  // private
  private tempData = [];

  constructor(
    public corporativoService: CorporativosService,
    private spinner: NgxSpinnerService

  ) { 
    // this.tempData = usersListData;
    
  }

  ngOnInit(): void {
    this.getListaCoporativos();
  }
  getListaCoporativos(){
    this.spinner.show(undefined,
      {
        type: 'ball-triangle-path',
        size: 'medium',
        bdColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        fullScreen: true
    });
    this.corporativoService.listaCorporativos().then( (res:any) =>{ 
      if(res.success){
        this.tempData = res.response['data'];
        this.rows = res.response['data'];
        this.spinner.hide();      
      }
    }).catch(err=>{
      console.log(err);
    });
  }
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempData.filter(function (d) {
      return d.Username.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  /**
   * updateLimit
   *
   * @param limit
   */
  updateLimit(limit) {
    this.limitRef = limit.target.value;
  }

}
