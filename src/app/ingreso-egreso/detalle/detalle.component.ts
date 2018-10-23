import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
// import { AppState } from '../../app.reducers';
import * as fromIngresoEgreso from '../ingreso-egreso.reducer';

import { IngresoEgresoService } from '../ingreso-egreso.service';

import { IngresoEgreso } from '../ingreso-egreso.model';

import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();

  items: IngresoEgreso[];

  constructor(private store: Store<fromIngresoEgreso.AppState>, private ies: IngresoEgresoService) { }

  ngOnInit() {
    this.subscription = this.store.select('ingresoEgreso').subscribe(
      (ingresoEgreso) => {
        this.items = ingresoEgreso.items;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  borrarIngresoEgreso(item: IngresoEgreso) {
    this.ies.borrarIngresoEgreso(item.uid)
      .then(() => {
        Swal('Eliminado', item.descripcion, 'success');
      })
    ;
  }

}
