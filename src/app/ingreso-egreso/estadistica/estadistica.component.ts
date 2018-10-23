import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
// import { AppState } from '../../app.reducers';
import * as fromIngresoEgreso from '../ingreso-egreso.reducer';

import { IngresoEgreso } from '../ingreso-egreso.model';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: []
})
export class EstadisticaComponent implements OnInit {
  subscription: Subscription = new Subscription();

  ingresos: number;
  egresos: number;

  cuantosIngresos: number;
  cuantosEgresos: number;

  public doughnutChartLabels: string[] = ['Ingresos', 'Egresos'];
  public doughnutChartColors: Array<any> = [{ backgroundColor: ['#28a745', '#dc3545']}];
  public doughnutChartData: number[] = [];

  constructor(private store: Store<fromIngresoEgreso.AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('ingresoEgreso').subscribe(
      (ingresoEgreso) => {
        this.contarIngresoEgreso(ingresoEgreso.items);
      }
    );
  }

  contarIngresoEgreso(items: IngresoEgreso[]) {
    this.ingresos = 0;
    this.egresos = 0;

    this.cuantosIngresos = 0;
    this.cuantosEgresos = 0;

    items.forEach(item => {
      if (item.tipo == 'ingreso') {
        this.cuantosIngresos ++;
        this.ingresos += item.monto;
      }

      if (item.tipo == 'egreso') {
        this.cuantosEgresos ++;
        this.egresos += item.monto;
      }
    });

    this.doughnutChartData = [
      this.ingresos,
      this.egresos
    ];
  }

}
