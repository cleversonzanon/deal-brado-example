import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PerfilService } from '../perfil.service';
import { Modulo } from '../../domains/modulo';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { ErroValidator } from '../../template/erro-validator';
import { ModuloService } from '../modulo.service';

@Component({
  selector: 'app-perfil-pesquisar',
  templateUrl: './perfil-pesquisar.component.html',
  styleUrls: ['./perfil-pesquisar.component.scss']
})
export class PerfilPesquisarComponent implements OnInit {

  @Output() clickVoltar: EventEmitter<any> = new EventEmitter<any>();
  filtrarForm: FormGroup;
  submitLoading = false;

  // Listas dos combos
  moduloList: Array<Modulo>;
  perfilList: Array<string>;
  statusList = [
    { value: true, label: 'admin-modulos.perfis.perfil-pesquisar.combo.status.ativo' },
    { value: false, label: 'admin-modulos.perfis.perfil-pesquisar.combo.status.inativos' },
  ];

  constructor(private _formBuilder: FormBuilder,
              private _router: Router,
              private _moduloService: ModuloService,
              private _perfilService: PerfilService) {
  }

  ngOnInit(): void {
    // Build do form de perfil
    this._buildForm();
    this._loadModulos();
    this._buildPerfilAutocomplete();
  }

  submitFiltro(): void {
    this._router.navigate([{ outlets: { modal: 'perfil-listar' } }], {
      queryParams: { filtros: window.btoa(JSON.stringify(this.filtrarForm.value)) }
    });
  }

  onClickVoltar(event: Event): void {
    event.stopPropagation();
    this.clickVoltar.emit();
  }

  private _buildForm() {
    this.filtrarForm = this._formBuilder.group({
      nome: null,
      ativo: null,
      modulos: null
    });
  }

  private _loadModulos(): void {
    this._moduloService
      .listarModulos()
      .subscribe(
        response => this.moduloList = response,
        err => ErroValidator.validaErroPerfil(err, this._router)
      )
    ;
  }

  private _buildPerfilAutocomplete(): void {
    this.filtrarForm.get('nome').valueChanges
      .pipe(
        startWith(''),
        distinctUntilChanged(),
        debounceTime(300)
      ).subscribe((value: string) => {

      if (value && value.length >= 3) {
        this._perfilService
          .filtrarPerfis(value)
          .subscribe(
            response => this.perfilList = response,
            err => ErroValidator.validaErroPerfil(err, this._router)
          );
      } else {
        this.perfilList = null;
      }
    });
  }
}
