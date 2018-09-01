import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MenuDeModulosComponent } from './menu-de-modulos/menu-de-modulos.component';
import { GuardsModule } from './shared/guards/guards.module';
import { TemplatesModule } from './shared/templates/templates.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { DirectivesModule } from './shared/directives/directives.module';
import { PipesModule } from './shared/pipes/pipes.module';
import { ChartTestComponent } from './chart-test/chart-test.component';
import { GoogleMapsTestComponent } from './google-maps-test/google-maps-test.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthModule } from './auth/auth.module';
import { AppMaterialModule } from './app-material.module';
import { ContentLoaderModule } from '@netbasal/content-loader';
import { LoadingModule } from 'ngx-loading';
import { AdminModule } from './admin/admin.module';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { NgxMaskModule } from 'ngx-mask';

const configTranslate = {
  loader: {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [HttpClient]
  }
};

@NgModule({
  declarations: [
    AppComponent,
    MenuDeModulosComponent,
    ChartTestComponent,
    GoogleMapsTestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,

    TranslateModule.forRoot(configTranslate),
    NgxPermissionsModule.forRoot(),
    NgxMaskModule.forRoot(),
    FlexLayoutModule,
    AppMaterialModule,
    ContentLoaderModule,
    LoadingModule,

    // Modulos da aplicacao
    TemplatesModule,
    GuardsModule,
    DirectivesModule,
    PipesModule,
    AuthModule,
    AdminModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
