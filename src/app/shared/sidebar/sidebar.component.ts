import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducers';

import { AuthService } from '../../auth/auth.service';
import { IngresoEgresoService } from '../../ingreso-egreso/ingreso-egreso.service';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();

  email: string;

  constructor(private store: Store<AppState>, private authService: AuthService, private ies: IngresoEgresoService) { }

  ngOnInit() {
    this.subscription = this.store.select('auth')
      .pipe(filter(auth => auth.user != null))
      .subscribe(auth => this.email = auth.user.email)
    ;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logout() {
    this.ies.cancelarSubsriptions();
    this.authService.logout();
  }

}
