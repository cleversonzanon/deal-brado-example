import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EsqueceuSenhaComponent } from './esqueceu-senha/esqueceu-senha.component';
import { TranslateModule } from '@ngx-translate/core';
import { AppMaterialModule } from '../app-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from '../app-routing.module';
import { AuthService } from './auth.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NovaSenhaComponent } from './nova-senha/nova-senha.component';
import { LoadingModule } from 'ngx-loading';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FlexLayoutModule,
    AppMaterialModule,
    AppRoutingModule,
    ReactiveFormsModule,
    LoadingModule
  ],
  declarations: [
    EsqueceuSenhaComponent,
    LoginComponent,
    NovaSenhaComponent,
  ],
  providers: [
    AuthService
  ]
})
export class AuthModule {
}
