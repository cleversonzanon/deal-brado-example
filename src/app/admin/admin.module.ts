import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { ModalTermoAceiteComponent } from './modal-termo-aceite/modal-termo-aceite.component';
import { AppMaterialModule } from '../app-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingModule } from 'ngx-loading';
import { ModalCrudComponent } from './template/modal-crud/modal-crud.component';
import { HomeModulosComponent } from './home-modulos/home-modulos.component';
import { RouterModule, Routes } from '@angular/router';
import { PerfilModalInicialComponent } from './perfil/perfil-modal-inicial/perfil-modal-inicial.component';
import { PerfilCriarNomeComponent } from './perfil/perfil-criar-nome/perfil-criar-nome.component';
import { PerfilEscolherModulosComponent } from './perfil/perfil-escolher-modulos/perfil-escolher-modulos.component';
import { PerfilPesquisarComponent } from './perfil/perfil-pesquisar/perfil-pesquisar.component';
import { PerfilListarComponent } from './perfil/perfil-listar/perfil-listar.component';
import { PerfilConfirmarInativacaoComponent } from './perfil/perfil-confirmar-inativacao/perfil-confirmar-inativacao.component';
import { PerfilConfirmarAtivacaoComponent } from './perfil/perfil-confirmar-ativacao/perfil-confirmar-ativacao.component';
import { PerfilFuncionalidadesComponent } from './perfil/perfil-funcionalidades/perfil-funcionalidades.component';
import { PerfilErroComponent } from './perfil/perfil-erro/perfil-erro.component';
import { UsuarioModalInicialComponent } from './usuario/usuario-modal-inicial/usuario-modal-inicial.component';
import { ModalHeaderComponent } from './template/modal-header/modal-header.component';
import { UsuarioCriarComponent } from './usuario/usuario-criar/usuario-criar.component';
import { UsuarioBuscarComponent } from './usuario/usuario-buscar/usuario-buscar.component';
import { UsuarioErroComponent } from './usuario/usuario-erro/usuario-erro.component';
import { NgxMaskModule } from 'ngx-mask';
import { UsuarioListarComponent } from './usuario/usuario-listar/usuario-listar.component';
import { PipesModule } from '../shared/pipes/pipes.module';
import { UsuarioConfirmarAtivacaoComponent } from './usuario/usuario-confirmar-ativacao/usuario-confirmar-ativacao.component';
import { UsuarioConfirmarInativacaoComponent } from './usuario/usuario-confirmar-inativacao/usuario-confirmar-inativacao.component';
import { UsuarioConfirmarResetSenhaComponent } from './usuario/usuario-confirmar-reset-senha/usuario-confirmar-reset-senha.component';
import { UsuarioEditarComponent } from './usuario/usuario-editar/usuario-editar.component';
import { ParametrosModalInicialComponent } from './parametrizacoes/parametros-modal-inicial/parametros-modal-inicial.component';
import { ParametrosInatividadeComponent } from './parametrizacoes/parametros-inatividade/parametros-inatividade.component';
import { ParametrosConfigEmailComponent } from './parametrizacoes/parametros-config-email/parametros-config-email.component';
import { ParametrosImgsEmailComponent } from './parametrizacoes/parametros-imgs-email/parametros-imgs-email.component';
import { ParametrosTermoUsoComponent } from './parametrizacoes/parametros-termo-uso/parametros-termo-uso.component';
import { ParametrosImgsSistemaComponent } from './parametrizacoes/parametros-imgs-sistema/parametros-imgs-sistema.component';
import { ParametrosImgsAppComponent } from './parametrizacoes/parametros-imgs-app/parametros-imgs-app.component';
import { InputFileImgComponent } from './parametrizacoes/shared/input-file-img/input-file-img.component';

const routes: Routes = [
  {
    path: 'modal-perfil-inicial',
    component: PerfilModalInicialComponent,
    outlet: 'modal'
  },
  {
    path: 'perfil-listar',
    component: PerfilListarComponent,
    outlet: 'modal'
  },
  {
    path: 'perfil-confirmar-ativacao',
    component: PerfilConfirmarAtivacaoComponent,
    outlet: 'modal'
  },
  {
    path: 'perfil-confirmar-inativacao',
    component: PerfilConfirmarInativacaoComponent,
    outlet: 'modal'
  },
  {
    path: 'perfil-escolher-modulos',
    component: PerfilEscolherModulosComponent,
    outlet: 'modal'
  },
  {
    path: 'perfil-funcionalidades',
    component: PerfilFuncionalidadesComponent,
    outlet: 'modal'
  },
  {
    path: 'modal-usuario-inicial',
    component: UsuarioModalInicialComponent,
    outlet: 'modal'
  },
  {
    path: 'usuario-listar',
    component: UsuarioListarComponent,
    outlet: 'modal'
  },
  {
    path: 'usuario-editar',
    component: UsuarioEditarComponent,
    outlet: 'modal'
  },
  {
    path: 'usuario-confirmar-ativacao',
    component: UsuarioConfirmarAtivacaoComponent,
    outlet: 'modal'
  },
  {
    path: 'usuario-confirmar-inativacao',
    component: UsuarioConfirmarInativacaoComponent,
    outlet: 'modal'
  },
  {
    path: 'usuario-confirmar-reset-senha',
    component: UsuarioConfirmarResetSenhaComponent,
    outlet: 'modal'
  },
  {
    path: 'modal-parametrizacoes-inicial',
    component: ParametrosModalInicialComponent,
    outlet: 'modal'
  }
];

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    FlexLayoutModule,
    AppMaterialModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingModule,
    RouterModule.forChild(routes),
    NgxMaskModule,
    PipesModule
  ],
  declarations: [
    HomeModulosComponent,
    ModalTermoAceiteComponent,
    ModalCrudComponent,
    PerfilModalInicialComponent,
    PerfilCriarNomeComponent,
    PerfilEscolherModulosComponent,
    PerfilPesquisarComponent,
    PerfilListarComponent,
    PerfilConfirmarInativacaoComponent,
    PerfilConfirmarAtivacaoComponent,
    PerfilFuncionalidadesComponent,
    PerfilErroComponent,
    UsuarioModalInicialComponent,
    ModalHeaderComponent,
    UsuarioCriarComponent,
    UsuarioBuscarComponent,
    UsuarioErroComponent,
    UsuarioListarComponent,
    UsuarioConfirmarAtivacaoComponent,
    UsuarioConfirmarInativacaoComponent,
    UsuarioConfirmarResetSenhaComponent,
    UsuarioEditarComponent,
    ParametrosModalInicialComponent,
    ParametrosInatividadeComponent,
    ParametrosConfigEmailComponent,
    ParametrosImgsEmailComponent,
    ParametrosTermoUsoComponent,
    ParametrosImgsSistemaComponent,
    ParametrosImgsAppComponent,
    InputFileImgComponent
  ],
  entryComponents: [
    ModalTermoAceiteComponent,
    ModalCrudComponent
  ]
})
export class AdminModule {
}
