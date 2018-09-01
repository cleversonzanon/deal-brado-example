import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ParametrizacoesService } from '../parametrizacoes.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ParametrosInatividade } from '../../domains/parametros-inatividade';

@Component({
  selector: 'app-parametros-inatividade',
  templateUrl: './parametros-inatividade.component.html',
  styleUrls: ['./parametros-inatividade.component.scss']
})
export class ParametrosInatividadeComponent implements OnInit {
  @Output() closePanel: EventEmitter<any> = new EventEmitter<any>();
  public inatividadeForm: FormGroup;
  public loading = false;

  constructor(private _parametrizacoesService: ParametrizacoesService,
              private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this._buildForm();
    this._recuperarParametrosInatividade();
  }

  submitParametros(): void {
    this.loading = true;
    const parametrosSalvar: ParametrosInatividade = this.inatividadeForm.value;
    this._parametrizacoesService
      .salvarInatividade(parametrosSalvar)
      .subscribe(resp => {
        console.log(resp);
        this.closePanel.emit();
        this.loading = false;
      }, err => {
        console.error(err);
        this.loading = false;
      });
  }

  private _buildForm() {
    this.inatividadeForm = this._formBuilder
      .group({
        daysInactive: 5,
        minutesInactive: 10
      });
  }

  private _recuperarParametrosInatividade() {
    this.loading = true;
    this._parametrizacoesService
      .recuperarInatividade()
      .subscribe(resp => {
        this.inatividadeForm.setValue({ ...resp });
        this.loading = false;
      }, err => {
        console.error(err);
        this.loading = false;
      });
  }
}
