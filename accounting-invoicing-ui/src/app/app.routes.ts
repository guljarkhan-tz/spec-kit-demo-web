import { Routes } from '@angular/router';

import { accountsRoutes } from '@features/accounts/accounts.routes';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'accounts' },
	...accountsRoutes,
	{ path: '**', redirectTo: 'accounts' },
];
