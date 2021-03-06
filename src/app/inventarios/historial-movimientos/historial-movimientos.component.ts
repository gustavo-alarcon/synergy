import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { MatPaginator, MatTableDataSource, MatSort } from "@angular/material";
import { ClientsService } from "../../servicios/clients.service";
import { ToastrService } from "ngx-toastr";
import { MessagesService } from "../../servicios/messages.service";
import * as crypto from "crypto-js";
import { HistorySales } from "../../classes/history-sales";
import { takeWhile } from "rxjs/operators";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ConfirmComponent } from "../../sales-history/confirm/confirm.component";
import { InventariosService } from "../../servicios/almacenes/inventarios.service";

@Component({
  selector: "app-historial-movimientos",
  templateUrl: "./historial-movimientos.component.html",
  styleUrls: ["./historial-movimientos.component.css"]
})
export class HistorialMovimientosComponent implements OnInit {
  history: any[] = [];
  displayedColumns = [
    "fecha",
    "type",
    "correlativo",
    "cliente",
    "usuario",
    "eliminar"
  ];
  dataSource: MatTableDataSource<any>;
  isLoadingResults = false;
  bytes = crypto.AES.decrypt(localStorage.getItem("db"), "meraki");
  bd = this.bytes.toString(crypto.enc.Utf8);
  send: string = "";
  programmed: string = "";
  balance: string = "";
  edit: boolean = false;
  historyTable: HistorySales[] = [];
  private alive: boolean = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private inventariosService: InventariosService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.getHistory();
  }

  ngOnInit() {}

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getHistory() {
    this.history = [];
    this.isLoadingResults = true;
    this.inventariosService
      .getHistorial()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          for (let i = 0; i < data.records.length; i++) {
            let alreadyIn = false;
            for (let j = 0; j < this.history.length; j++) {
              if (data.records[i].Operacion == this.history[j].Operacion) {
                alreadyIn = true;
              }
            }
            if (!alreadyIn) {
              this.history.push({
                Correlativo: parseInt(data.records[i].Correlativo),
                Serie: data.records[i].Serie,
                Documento: data.records[i].Documento,
                Operacion: data.records[i].Operacion,
                Fecha: data.records[i].Fecha,
                Usuario: data.records[i].Usuario,
                Estado: data.records[i].Estado,
                Total: data.records[i].Total,
                IGV: data.records[i].IGV,
                Entregado: data.records[i].Entregado,
                Vuelto: data.records[i].Vuelto,
                TipoIGV: data.records[i].Tipo_igv,
                TipoPago: data.records[i].TipoPago,
                SubTotal: data.records[i].SubTotal,
                AlmacenDestino: data.records[i].Almacen_destino,
                AlmacenOrigen: data.records[i].Almacen_origen,
                Cantidad: data.records[i].Cantidad,
                Compra: data.records[i].Compra,
                Moneda: data.records[i].Moneda,
                Movimiento: data.records[i].Movimiento,
                Tercero: data.records[i].Tercero,
                Venta: data.records[i].Venta,
                POS: data.records[i].POS
              });
            }
          }
          this.isLoadingResults = false;
          this.dataSource = new MatTableDataSource(this.history);
          this.dataSource.paginator = this.paginator;
        },
        err => {
          this.isLoadingResults = false;
          this.toastr.error("Ocurrio un error", "Error");
          this.cd.markForCheck();
        }
      );
  }

  changeState(i) {
    let dialogRef = this.dialog.open(ConfirmComponent, {
      width: "auto",
      data: "text"
    });

    dialogRef.beforeClose().subscribe(result => {
      if (result != "close" && result != undefined) {
        let erase = {
          Operacion: null,
          Estado: null
        };
        erase.Operacion = this.history[i].Operacion;
        erase.Estado = this.history[i].Estado;
        /*this.inventariosService
          .removeSale(this.bd, erase)
          .pipe(takeWhile(() => this.alive))
          .subscribe(
            data => {
              this.toastr.success("Se anulo la venta con exito", "Exito");
              this.history[i].Estado = "1";
              this.cd.markForCheck();
            },
            err => {
              this.toastr.error("Hubo un error", "Error");
            }
          );*/
      }
    });
  }

  orderArray() {
    /*let last = '';
     let positionLast = 0;*/
    /*for (let i = 0; i < this.history.length; i++) {
      if (this.history[i].Correlativo != last) {
        this.historyTable.push({
          correlativo: this.history[i].Correlativo,
          fecha: this.history[i].Fecha,
          usuario: this.history[i].Usuario,
          estado : this.history[i].Estado,
          products: []
        });
        last = this.history[i].Correlativo;
        positionLast = this.historyTable.length-1;
        this.historyTable[this.historyTable.length-1].products.push({
          producto: this.history[i].Producto,
          cantidad: this.history[i].Cantidad,
          operacion: this.history[i].Operacion,
          venta: this.history[i].Venta
        });
      }
      else {
        this.historyTable[positionLast].products.push({
          producto: this.history[i].Producto,
          cantidad: this.history[i].Cantidad,
          operacion: parseInt(this.history[i].Operacion),
          venta: this.history[i].Venta
        });
      }
    }
    for (let i = 0; i < this.historyTable.length; i++) {
      this.historyTable[i].products.sort(this.dynamicSort("operacion")); 
    }
      this.isLoadingResults = false;
      this.dataSource = new MatTableDataSource(this.historyTable);
      this.dataSource.paginator = this.paginator;
      */
  }

  dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function(a, b) {
      var result =
        a[property] > b[property] ? -1 : a[property] < b[property] ? 1 : 0;
      return result * sortOrder;
    };
  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.alive = false;
  }
}
