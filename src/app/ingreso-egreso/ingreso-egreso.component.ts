import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
// import { AppState } from '../app.reducers';
import * as fromIngresoEgreso from '../ingreso-egreso/ingreso-egreso.reducer';

import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';

import { IngresoEgresoService } from './ingreso-egreso.service';

import { IngresoEgreso } from './ingreso-egreso.model';

import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();

  isLoading: boolean;

  forma: FormGroup;
  tipo: string = 'ingreso';

  constructor(private store: Store<fromIngresoEgreso.AppState>, private ies: IngresoEgresoService) { }

  ngOnInit() {
    this.subscription = this.store.select('ui').subscribe((ui) => {
      this.isLoading = ui.isLoading;
    });

    this.forma = new FormGroup({
      'descripcion': new FormControl('', Validators.required),
      'monto': new FormControl(0, Validators.min(0))
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  crearIngresoEgreso() {
    this.store.dispatch(new ActivarLoadingAction());

    const ingresoEgreso  = new IngresoEgreso({
      ... this.forma.value,
      tipo: this.tipo
    });

    this.ies.crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        this.store.dispatch(new DesactivarLoadingAction());

        this.forma.reset({
          descripcion: '',
          monto: 0
        });

        Swal('Creado', ingresoEgreso.descripcion, 'success');
      })
      .catch((error) => {
        this.store.dispatch(new DesactivarLoadingAction());
        Swal('Error en el login', error.message, 'error');
      })
    ;
  }

}
