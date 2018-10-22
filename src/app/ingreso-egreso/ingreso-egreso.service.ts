import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducers';
import { SetItemsAction, UnsetItemsAction } from './ingreso-egreso.actions';

import { AuthService } from '../auth/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';

import { IngresoEgreso } from './ingreso-egreso.model';

import { Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Injectable()
export class IngresoEgresoService {
  ingresoEgresoListenerSubscription = new Subscription();
  ingresoEgresoItemsSubscription = new Subscription();

  constructor(private store: Store<AppState>, private auth: AuthService, private afs: AngularFirestore) { }

  initIngreoEgresoListener() {
    this.ingresoEgresoListenerSubscription = this.store.select('auth')
      .pipe(
        filter(auth => auth.user != null)
      )
      .subscribe(auth => {
        this.ingresoEgresoItems(auth.user.uid);
      })
    ;
  }

  private ingresoEgresoItems(uid: string) {
    this.ingresoEgresoItemsSubscription = this.afs.collection(`${ uid }/ingresos-egresos/items`).snapshotChanges()
      .pipe(
        map(docData => {
          return docData.map(doc => {
            return {
              uid: doc.payload.doc.id,
              ... doc.payload.doc.data()
            };
          });
        })
      )
      .subscribe(
        (coleccion: any[]) => {
          this.store.dispatch(new SetItemsAction(coleccion));
        }
      )
    ;
  }

  cancelarSubsriptions() {
    this.ingresoEgresoListenerSubscription.unsubscribe();
    this.ingresoEgresoItemsSubscription.unsubscribe();

    this.store.dispatch(new UnsetItemsAction());
  }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const user = this.auth.getUsuario();

    return this.afs.doc(`${ user.uid }/ingresos-egresos`).collection('items').add({
      ... ingresoEgreso
    });
  }

  borrarIngresoEgreso(uid: string) {
    const user = this.auth.getUsuario();

    return this.afs.doc(`${ user.uid }/ingresos-egresos/items/${ uid }`).delete();
  }

}
