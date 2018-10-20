import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

import { Router } from '@angular/router';

import * as firebase from 'firebase';
import Swal from 'sweetalert2';

import { map } from 'rxjs/operators';

import { User } from './user.model';

@Injectable()
export class AuthService {

  constructor(private afa: AngularFireAuth, private router: Router, private afs: AngularFirestore) { }

  initAuthListener() {
    this.afa.authState.subscribe(
      (fbUser: firebase.User) => {
        console.log(fbUser);
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
    this.afa.auth.createUserWithEmailAndPassword(email, password)
      .then(resp => {
        const user: User = {
          uid: resp.user.uid,
          email: resp.user.email
        };

        this.afs.doc(`${ user.uid }/usuario`).set(user).then(
          () => {
            this.router.navigate(['/']);
          }
        );
      })
      .catch(error => {
        Swal('Error al crear usuario', error.message, 'error');
      })
    ;
  }

  login(email: string, password: string) {
    this.afa.auth.signInWithEmailAndPassword(email, password)
      .then(resp => {
        this.router.navigate(['/']);
      })
      .catch(error => {
        Swal('Error en el login', error.message, 'error');
      })
    ;
  }

  logout() {
    this.afa.auth.signOut();
    this.router.navigate(['/login']);
  }

}
