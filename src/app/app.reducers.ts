import { ActionReducerMap } from '@ngrx/store';

import * as fromUI from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer';
// import * as fromIngreoEgreso from './ingreso-egreso/ingreso-egreso.reducer';

export interface AppState {
    ui: fromUI.State,
    auth: fromAuth.AuthState,
    // ingresoEgreso: fromIngreoEgreso.IngresoEgresoState
}

export const AppReducers: ActionReducerMap<AppState> = {
    ui: fromUI.uiReducer,
    auth: fromAuth.authReducer,
    // ingresoEgreso: fromIngreoEgreso.ingresoEgresoReducer
};