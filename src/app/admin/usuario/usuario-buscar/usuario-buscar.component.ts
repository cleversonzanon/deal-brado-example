import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TipoUsuario } from '../../domains/enum/tipo-usuario';
import { ErroValidator } from '../../template/erro-validator';
import { TerminalService } from '../terminal.service';
import { PerfilService } from '../../perfil/perfil.service';
import { Terminal } from '../../domains/terminal';
import { PerfilSuggest } from '../../domains/perfil-suggest';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { UsuarioService } from '../usuario.service';
import { UnidadeServicoService } from '../unidade-servico.service';
import { UnidadeServico } from '../../domains/unidade-servico';

@Component({
  selector: 'app-usuario-buscar',
  templateUrl: './usuario-buscar.component.html',
  styleUrls: ['./usuario-buscar.component.scss']
})
export class UsuarioBuscarComponent implements OnInit {
  @Output() clickVoltar: EventEmitter<any> = new EventEmitter<any>();
  loading = false;
  filtroForm: FormGroup;
  TipoUsuario = TipoUsuario;
  tiposUsuarios: string[];
  usuarioList: Array<string>;
  terminais: Terminal[];
  unidadeServico: UnidadeServico[];
  perfis: PerfilSuggest[];
  statusList = [
    { value: true, label: 'admin-modulos.usuarios.buscar-usuario.input.ativos' },
    { value: false, label: 'admin-modulos.usuarios.buscar-usuario.input.inativos' },
  ];

  constructor(private _formBuilder: FormBuilder,
              private _router: Router,
              private _unidadesDeServicoService: UnidadeServicoService,
              private _perfilService: PerfilService,
              private _usuarioService: UsuarioService,
              private _terminalService: TerminalService) {
  }

  ngOnInit(): void {
    this._buildForm();
    this._buildFormUsuarioAutocomplete();
    this._recuperarTerminais();
    this._recuperarUnidadesDeServico();
    this._recuperarPerfis();
    this.tiposUsuarios = Object.keys(this.TipoUsuario);
  }

  onClickVoltar(event: Event): void {
    event.stopPropagation();
    this.clickVoltar.emit();
  }

  submitFiltrar(): void {
    this._router.navigate([{ outlets: { modal: 'usuario-listar' } }], {
      queryParams: { filtros: window.btoa(JSON.stringify(this.filtroForm.value)) }
    });
  }

  downloadExport(): void {
    this.loading = true;
    this._usuarioService.downloadExport()
      .subscribe(
        () => this.loading = false,
        () => this.loading = false
      );
  }

  private _buildForm() {
    this.filtroForm = this._formBuilder.group({
      perfilAutorizacao: null,
      nome: null,
      tipoUsuario: null,
      terminais: null,
      ativo: null,
      unidadeDeServico: null
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

  private _recuperarPerfis() {
    this._perfilService
      .suggest()
      .subscribe(perfis => {
        this.perfis = perfis;
      }, err => {
        ErroValidator.validaErroUsuario(err, this._router);
      });
  }

  private _buildFormUsuarioAutocomplete() {
    this.filtroForm
      .get('nome')
      .valueChanges
      .pipe(
        startWith(''),
        distinctUntilChanged(),
        debounceTime(300)
      )
      .subscribe((value: string) => {
        if (value && value.length >= 3) {
          this._usuarioService
            .filtrarUsuarios(value)
            .subscribe(
              resp => this.usuarioList = resp,
              err => ErroValidator.validaErroUsuario(err, this._router)
            );
        } else {
          this.usuarioList = null;
        }
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
}
