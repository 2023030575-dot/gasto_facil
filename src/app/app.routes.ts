import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./pages/layout/layout.page')
        .then(m => m.LayoutPage),

    children: [

      {
        path: 'home',
        loadComponent: () =>
          import('./home/home.page')
            .then(m => m.HomePage),
      },

      {
        path: 'page-newgasto',
        loadComponent: () =>
          import('./pages/page-newgasto/page-newgasto.page')
            .then(m => m.PageNewgastoPage)
      },

      {
        path: 'page-gastos',
        loadComponent: () =>
          import('./pages/page-gastos/page-gastos.page')
            .then(m => m.PageGastosPage)
      },

      {
        path: 'page-scan',
        loadComponent: () =>
          import('./pages/page-scan/page-scan.page')
            .then(m => m.PageScanPage)
      },

      {
        path: 'page-resume',
        loadComponent: () =>
          import('./pages/page-resume/page-resume.page')
            .then(m => m.PageResumePage)
      },
      {
        path: 'confirmar-gasto',
        loadComponent: () => import('./pages/confirmar-gasto/confirmar-gasto.page').then( m => m.ConfirmarGastoPage)
      },

      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      }

    ]
  }

];