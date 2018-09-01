import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../usuario.service';
import { Terminal } from '../../domains/terminal';
import { TerminalService } from '../terminal.service';
import { PerfilService } from '../../perfil/perfil.service';
import { PerfilSuggest } from '../../domains/perfil-suggest';
import { ErroValidator } from '../../template/erro-validator';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoUsuario } from '../../domains/enum/tipo-usuario';
import { Usuario } from '../../domains/usuario';
import { EmpresaSuggest } from '../../domains/empresa-suggest';
import { ErroBack } from '../../../domains/erro-back';
import { UnidadeServicoService } from '../unidade-servico.service';
import { UnidadeServico } from '../../domains/unidade-servico';

@Component({
  selector: 'app-usuario-criar',
  templateUrl: './usuario-criar.component.html',
  styleUrls: ['./usuario-criar.component.scss']
})
export class UsuarioCriarComponent implements OnInit {
  private static ERRO_EMAIL_DUPLICADO = 'Exception.user.duplicated.email';

  @Output() clickVoltar: EventEmitter<any> = new EventEmitter<any>();
  loading = false;
  TipoUsuario = TipoUsuario;
  usuarioForm: FormGroup;
  tiposUsuarios;
  terminais: Terminal[];
  unidadeServico: UnidadeServico[];
  perfis: PerfilSuggest[];
  usuarioEditar: Usuario;

  empresas = [{
    tipoUsuario: TipoUsuario.CARRIER,
    empresaSuggest: []
  }, {
    tipoUsuario: TipoUsuario.CLIENT_GROUP,
    empresaSuggest: []
  }, {
    tipoUsuario: TipoUsuario.SHIPOWNER,
    empresaSuggest: []
  }];

  constructor(private _formBuilder: FormBuilder,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _unidadesDeServicoService: UnidadeServicoService,
              private _terminalService: TerminalService,
              private _perfilService: PerfilService,
              private _usuarioService: UsuarioService) {
  }

  ngOnInit(): void {
    this._buildForm();
    this._buildFormTipoUsuarioWatch();
    this._recuperarTerminais();
    this._recuperarUnidadesDeServico();
    this._recuperarPerfis();
    this._recuperarTiposUsuarios();

    /* Valida se precisa recuperar o usuario (edicao) */
    const idUsuario = this._activatedRoute.snapshot.queryParams.usuarioId;
    /* Recuperar o usuario caso tenha id na url */
    if (idUsuario) {
      this._recuperarUsuario(idUsuario);
    }
  }

  onClickVoltar(event: Event): void {
    event.stopPropagation();
    this.clickVoltar.emit();
  }

  submitUsuario(): void {
    /* Valida se o form é valido */
    if (this.usuarioForm.valid) {
      /* Adiciona loading da tela */
      this.loading = true;
      /* Pega o usuario do form */
      const usuarioToSave: Usuario = this.usuarioForm.value;
      /* Pega as empresas selecionadas */
      const empresas: EmpresaSuggest[] = this.usuarioForm.get('empresa').value;
      /* Valida se tem algum empresa selecionada */
      if (empresas != null) {
        usuarioToSave.carrierIdList = empresas
          .filter(item => item.tipo === TipoUsuario.CARRIER)
          .map(item => item.id);
        usuarioToSave.clientGroupIdList = empresas
          .filter(item => item.tipo === TipoUsuario.CLIENT_GROUP)
          .map(item => item.id);
        usuarioToSave.shipownerIdList = empresas
          .filter(item => item.tipo === TipoUsuario.SHIPOWNER)
          .map(item => item.id);
      }

      /* Valida id do usuario (edicao) */
      if (this.usuarioEditar) {
        usuarioToSave.id = this.usuarioEditar.id;
      }

      /* Chamada servico usuario */
      this._usuarioService
        .salvar(usuarioToSave)
        .subscribe(() => {
          /* Remove o loading da tela */
          this.loading = false;
        }, err => {
          /* Remove o loading da tela */
          this.loading = false;
          /* Validacao generica de erro para tela 500 (robo) */
          ErroValidator.validaErroUsuario(err, this._router);
          /* Validacao de erro 400 (tratado pelo backend) */
          if (err.status === 400) {
            /* Converte erro em tipo conhecido */
            const erro: ErroBack = err.error.messages[0];
            /* Erro de e-mail duplicado */
            if (erro.code === UsuarioCriarComponent.ERRO_EMAIL_DUPLICADO) {
              this.usuarioForm
                .get('email')
                .setErrors({
                  'email-duplicado': { msg: erro.message }
                });
            }
          }
        });
    }
  }

  private _buildForm() {
    this.usuarioForm = this._formBuilder.group({
      // Usuario.email
      email: [null, [
        Validators.required,
        Validators.email
      ]],
      // Usuario.name
      name: [null, [
        Validators.required
      ]],
      // Usuario.profileId
      profileId: [null, [
        Validators.required
      ]],
      // Usuario.terminalIdList
      terminalIdList: null,
      // controle local
      tipoUsuario: null,
      // controle local
      empresa: [{
        value: null,
        disabled: true
      }],
      // Usuario.phone
      phone: [null, [
        Validators.minLength(10)
      ]],
      // Usuario.serviceUnitIdList
      serviceUnitIdList: null
    });
  }

  private _buildFormTipoUsuarioWatch() {
    this.usuarioForm.get('tipoUsuario').valueChanges
      .subscribe((tipos: string[]) => {
        /* Instancia do input de empresa */
        const empresaInput = this.usuarioForm.get('empresa');
        /* Seta o status do input de empresa (habilitada ou desabilitado) */
        tipos.length > 0 ? empresaInput.enable() : empresaInput.disable();
        /* Limpa o objeto de empresas */
        tipos.map(tipo => {
          switch (TipoUsuario[tipo]) {
            case TipoUsuario.SHIPOWNER:
              this._recuperarEempresaArmador();
              break;
            case TipoUsuario.CLIENT_GROUP:
              this._recuperarEempresaGrupoCliente();
              break;
            case TipoUsuario.CARRIER:
              this._recuperarEempresaTransportadora();
              break;
          }
        });
      });
  }

  private _recuperarTerminais() {
    this._terminalService
      .listar()
      .subscribe(terminais => {
        this.terminais = terminais;
      }, err => {
        ErroValidator.validaErroUsuario(err, this._router);
      });
  }

  private _recuperarUnidadesDeServico() {
    this._unidadesDeServicoService
      .listar()
      .subscribe(unidadeServico => {
        this.unidadeServico = unidadeServico;
      }, err => {
        ErroValidator.validaErroUsuario(err, this._router);
      });
  }

  private _recuperarPerfis() {
    this._perfilService
      .suggest()
      .subscribe(perfis => {
        this.perfis = perfis;
      }, err => {
        ErroValidator.validaErroUsuario(err, this._router);
      });
  }

  private _recuperarTiposUsuarios() {
    this.tiposUsuarios = Object.keys(this.TipoUsuario);
  }

  private _recuperarEempresaArmador() {
    this._usuarioService
      .listarArmadores()
      .subscribe(armadores => {
        this.empresas.forEach(empresa => {
          if (empresa.tipoUsuario === TipoUsuario.SHIPOWNER) {
            /* Adiciona as empresas no combo */
            empresa.empresaSuggest = armadores.map(tra => {
              tra.tipo = TipoUsuario.SHIPOWNER;
              return tra;
            });

            /* Valida quais estao selecioadas (edicao)*/
            if (this.usuarioEditar) {
              const empresasSelecionadas = empresa.empresaSuggest.filter(suggest => {
                if (this.usuarioEditar.shipownerIdList.includes(suggest.id)) {
                  return suggest;
                }
              });
              this._atribuiEmpresasSelecionadasForm(empresasSelecionadas);
            }
          }
        });
      }, err => {
        ErroValidator.validaErroUsuario(err, this._router);
      });
  }

  private _recuperarEempresaGrupoCliente() {
    this._usuarioService
      .listarGrupoDeClientes()
      .subscribe(grupoCliente => {
        this.empresas.forEach(empresa => {
          if (empresa.tipoUsuario === TipoUsuario.CLIENT_GROUP) {
            /* Adiciona as empresas no combo */
            empresa.empresaSuggest = grupoCliente.map(tra => {
              tra.tipo = TipoUsuario.CLIENT_GROUP;
              return tra;
            });

            /* Valida quais estao selecioadas (edicao)*/
            if (this.usuarioEditar) {
              const empresasSelecionadas = empresa.empresaSuggest.filter(suggest => {
                if (this.usuarioEditar.clientGroupIdList.includes(suggest.id)) {
                  return suggest;
                }
              });
              this._atribuiEmpresasSelecionadasForm(empresasSelecionadas);
            }
          }
        });
      }, err => {
        /* Valida qual o tipo de erro */
        ErroValidator.validaErroUsuario(err, this._router);
      });
  }

  private _recuperarEempresaTransportadora() {
    this._usuarioService
      .listarTransportadoras()
      .subscribe(transportadoras => {
        this.empresas.forEach(empresa => {
          if (empresa.tipoUsuario === TipoUsuario.CARRIER) {
            /* Adiciona as empresas no combo */
            empresa.empresaSuggest = transportadoras.map(tra => {
              tra.tipo = TipoUsuario.CARRIER;
              return tra;
            });

            /* Valida quais estao selecioadas (edicao)*/
            if (this.usuarioEditar) {
              const empresasSelecionadas = empresa.empresaSuggest.filter(suggest => {
                if (this.usuarioEditar.carrierIdList.includes(suggest.id)) {
                  return suggest;
                }
              });
              this._atribuiEmpresasSelecionadasForm(empresasSelecionadas);
            }
          }
        });
      }, err => {
        /* Valida qual o tipo de erro */
        ErroValidator.validaErroUsuario(err, this._router);
      });
  }

  private _recuperarUsuario(idUsuario: number) {
    /* Ativa o loading da tela do usuario */
    this.loading = true;
    /* Servico para recuperar o usuario */
    this._usuarioService
      .recuperarPorId(idUsuario)
      .subscribe(usuario => {
        /* Seta o usuario a editar para controle local */
        this.usuarioEditar = usuario;

        /* Seta os valores do usuario no form */
        this.usuarioForm.setValue({
          email: usuario.email,
          name: usuario.name,
          phone: usuario.phone,
          profileId: usuario.profileId,
          tipoUsuario: usuario.userTypeList,
          serviceUnitIdList: usuario.serviceUnitIdList,
          terminalIdList: usuario.terminalIdList,
          empresa: []
        });

        /* Remove o loading da tela */
        this.loading = false;
      }, err => {
        /* Remove o loading da tela */
        this.loading = false;
        /* Valida qual o tipo de erro */
        ErroValidator.validaErroUsuario(err, this._router);
      });
  }

  private _atribuiEmpresasSelecionadasForm(empresasSelecionadas: any[]) {
    /* Recuperar o input de empresas */
    const inputEmpresas = this.usuarioForm.get('empresa');
    /* Concatena valor das empresas recebidas por parametro com as que ja estao no input */
    const empresas = empresasSelecionadas.concat(inputEmpresas.value);
    /* Seta as empresas no input */
    inputEmpresas.setValue(empresas);
  }
}
