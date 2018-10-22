import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducers';

import { AuthService } from '../auth.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();

  isLoading: boolean;

  constructor(public store: Store<AppState>, public authService: AuthService) { }

  ngOnInit() {
    this.subscription = this.store.select('ui').subscribe(
      (ui) => {
        this.isLoading = ui.isLoading;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit(data: any) {
    this.authService.crearUsuario(data.email, data.password);
  }
}
