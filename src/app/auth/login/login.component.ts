import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducers';

import { AuthService } from '../auth.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  isLoading: boolean;

  constructor(private store: Store<AppState>, private authService: AuthService) { }

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
    this.authService.login(data.email, data.password);
  }

}
