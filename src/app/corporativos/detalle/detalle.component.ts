import { Component, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { CorporativosService } from 'app/shared/corporativos/corporativos.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { DatatableComponent, ColumnMode } from "@swimlane/ngx-datatable";


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  corporativoID:string;
  

  formGeneral:any = [];
  formContact:any = [];
  flagTab1:boolean = true;
  urlIMG:string;
  tableContacts:any;
  public limitRef = 10;
  private tempData = [];
  flagNewOrEdit:boolean = false;
  idContacto:any;
  constructor(
    private route: ActivatedRoute,
    public fb: FormBuilder,
    public corporativoService: CorporativosService,
    private spinner: NgxSpinnerService
  ) { 
    this.formGeneral = this.fb.group({
      nombre_corto: [null],
      nombreCompleto: [null],
      status: [null],
      fechaIncorporacion: [null],
      urlSystema: [null],
      id: [null]
    });

    this.formContact = this.fb.group({
      S_Nombre: [null, Validators.required],
      S_Puesto: [null, Validators.required],
      S_Comentarios: [null],
      N_TelefonoFijo: [null],
      N_TelefonoMovil: [null],
      S_Email: [null, Validators.required],
      tw_corporativo_id: [null]
    });
  }

  ngOnInit(): void {
    this.corporativoID = this.route.snapshot.paramMap.get("id");    
    this.getCorporativo();
  }
  getCorporativo(){
    this.spinner.show(undefined,
      {
        type: 'ball-triangle-path',
        size: 'medium',
        bdColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        fullScreen: true
      });
    this.corporativoService.getDetalleCorporativoID(this.corporativoID).then( res=>{
      if(res.success){
      
        let dataGenerales =res['response']['data']['corporativo'];
        this.tableContacts =res['response']['data']['corporativo'].tw_contactos_corporativo;
        this.tempData = res['response']['data']['corporativo'].tw_contactos_corporativo;

        this.formGeneral.patchValue({
          nombre_corto: dataGenerales.S_NombreCorto,
          nombreCompleto: dataGenerales.S_NombreCompleto,
          status: dataGenerales.S_Activo,
          fechaIncorporacion: dataGenerales.D_FechaIncorporacion,
          urlSystema: dataGenerales.S_SystemUrl,
          id: dataGenerales.id,
        });     
        this.urlIMG =  dataGenerales.S_LogoURL;
      }else{
        Swal.fire({
          title: "¡Error!",
          text: "Error de comunicacion, intente de nuevo",
          icon: "error",
          customClass: {
            confirmButton: 'btn btn-primary'
          },
          buttonsStyling: false,
        });
        
      }
      this.spinner.hide();      
    }).catch(err=>{
      this.spinner.hide();

      Swal.fire({
        title: "¡Error!",
        text: "Revisa tus datos de acceso",
        icon: "error",
        customClass: {
          confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false,
      });
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
    this.tableContacts = temp;
    // Whenever the filter changes, always go back to the first page
    this.tableContacts.offset = 0;
  }
  editar(){
    this.flagTab1 = this.flagTab1 == true ? false: true;    
  }
  updateLimit(limit) {
    this.limitRef = limit.target.value;
  }
  editarContacto(contact){
    this.flagNewOrEdit = true;
    this.idContacto = contact.id;
    this.formContact.patchValue({
      S_Nombre: contact.S_Nombre,
      S_Puesto: contact.S_Puesto,
      S_Comentarios: contact.S_Comentarios,
      N_TelefonoFijo: contact.N_TelefonoFijo,
      N_TelefonoMovil: contact.N_TelefonoMovil,
      S_Email: contact.S_Email,
      tw_corporativo_id: contact.tw_corporativo_id,
    });    

  }
  saveNewContact(){
    Swal.showLoading();
    this.formContact.patchValue({tw_corporativo_id: this.corporativoID});    
    this.corporativoService.newContacto(this.formContact.value).then( res=>{
      console.log(res);
      Swal.close();
      if(res.success){
        Swal.fire('Listo!','Contacto creado con exito!', 'success');
        this.getCorporativo();
        this.formContact.reset();
        
      }
    
    }).catch(err=>{
      Swal.fire({
        title: "¡Error!",
        text: "Error de comunicacion, intente de nuevo",
        icon: "error",
        customClass: {
          confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false,
      });
      console.log(err);
    });
  }
  saveEditContact(){
    Swal.showLoading();
    this.corporativoService.editarContacto(this.idContacto,this.formContact.value).then( res=>{
      console.log(res);
      Swal.close();
      if(res.success){
        Swal.fire('Listo!','Contacto editado con exito!', 'success');
        this.getCorporativo();
        this.formContact.reset();
        
      }
    
    }).catch(err=>{
      Swal.fire({
        title: "¡Error!",
        text: "Error de comunicacion, intente de nuevo",
        icon: "error",
        customClass: {
          confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false,
      });
      console.log(err);
    });
  }
  deleteContact(contact){
    Swal.fire({
      title: 'segurdo de Eliminar el Contacto?',
      
      showCancelButton: true,
      buttonsStyling: true,
      confirmButtonText: 'si, Eliminar!',      
      denyButtonText: `cancelar`,
    }).then((result) => {
      if (result.value) {
        Swal.showLoading();
        this.corporativoService.deleteContact(contact.id).then( res=>{
          
          if(res.success){
            Swal.fire('Listo!','Contacto eliminado con exito!', 'success');
            this.getCorporativo();        
          }
          Swal.close();

        
        }).catch(err=>{
          Swal.fire({
            title: "¡Error!",
            text: "Error de comunicacion, intente de nuevo",
            icon: "error",
            customClass: {
              confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false,
          });
          console.log(err);
        });
      }

    })
  }
}
