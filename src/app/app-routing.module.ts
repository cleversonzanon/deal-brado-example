import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EsqueceuSenhaComponent } from './auth/esqueceu-senha/esqueceu-senha.component';
import { MenuDeModulosComponent } from './menu-de-modulos/menu-de-modulos.component';
import { TemplateComponent } from './shared/templates/template.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ChartTestComponent } from './chart-test/chart-test.component';
import { GoogleMapsTestComponent } from './google-maps-test/google-maps-test.component';
import { LoginComponent } from './auth/login/login.component';
import { NovaSenhaComponent } from './auth/nova-senha/nova-senha.component';
import { HomeModulosComponent } from './admin/home-modulos/home-modulos.component';

const routes: Routes = [
  {
    path: 'inicio',
    component: LoginComponent
  },
  {
    path: 'esqueceu-senha',
    component: EsqueceuSenhaComponent
  },
  {
    path: 'nova-senha/:token',
    component: NovaSenhaComponent
  },
  {
    path: 'admin',
    component: HomeModulosComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'app',
    component: TemplateComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'modulos',
        component: MenuDeModulosComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'ADMIN',
            redirectTo: 'inicio'
          }
        }
      }
    ]
  },
  { path: 'chart-test', component: ChartTestComponent },
  { path: 'maps-test', component: GoogleMapsTestComponent },
  { path: '**', redirectTo: 'inicio' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
