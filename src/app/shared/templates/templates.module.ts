import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateComponent } from './template.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AppRoutingModule } from '../../app-routing.module';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    NgxPermissionsModule
  ],
  declarations: [TemplateComponent]
})
export class TemplatesModule {
}
