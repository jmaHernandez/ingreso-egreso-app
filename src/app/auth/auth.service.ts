import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducers';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';
import { SetUserAction } from './auth.actions';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

import { Router } from '@angular/router';

import * as firebase from 'firebase';
import Swal from 'sweetalert2';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from './user.model';

@Injectable()
export class AuthService {
  subscription: Subscription = new Subscription();

  constructor(private afa: AngularFireAuth, private router: Router, private afs: AngularFirestore, private store: Store<AppState>) { }

  initAuthListener() {
    this.afa.authState.subscribe(
      (fbUser: firebase.User) => {
        if (fbUser) {
          this.subscription = this.afs.doc(`${ fbUser.uid }/usuario`).valueChanges().subscribe(
            (usrObj: any) => {
              const newUser = new User(usrObj);
              this.store.dispatch(new SetUserAction(newUser));
            }
          );
        } else {
          this.subscription.unsubscribe();
        }
      }
    );
  }

  isAuth() {
    return this.afa.authState
      .pipe(
        map(fbUser => {
          if (fbUser == null) {
            this.router.navigate(['/login']);
          }

          return fbUser != null;
        })
      )
    ;
  }

  crearUsuario(email: string, password: string) {
    this.store.dispatch(new ActivarLoadingAction());
    
    this.afa.auth.createUserWithEmailAndPassword(email, password)
      .then(resp => {
        const user: User = {
          uid: resp.user.uid,
          email: resp.user.email
        };

        this.afs.doc(`${ user.uid }/usuario`).set(user).then(
          () => {
            this.store.dispatch(new DesactivarLoadingAction());
            this.router.navigate(['/']);
          }
        );
      })
      .catch(error => {
        this.store.dispatch(new DesactivarLoadingAction());
        Swal('Error al crear usuario', error.message, 'error');
      })
    ;
  }

  login(email: string, password: string) {
    this.store.dispatch(new ActivarLoadingAction());

    this.afa.auth.signInWithEmailAndPassword(email, password)
      .then(resp => {
        this.store.dispatch(new DesactivarLoadingAction());
        this.router.navigate(['/']);
      })
      .catch(error => {
        this.store.dispatch(new DesactivarLoadingAction());
        Swal('Error en el login', error.message, 'error');
      })
    ;
  }

  logout() {
    this.afa.auth.signOut();
    this.router.navigate(['/login']);
  }

}
