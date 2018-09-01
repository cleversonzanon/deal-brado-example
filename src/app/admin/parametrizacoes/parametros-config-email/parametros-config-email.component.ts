import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ParametrizacoesService } from '../parametrizacoes.service';
import { ParametrosConfigEmail } from '../../domains/parametros-config-email';

@Component({
  selector: 'app-parametros-config-email',
  templateUrl: './parametros-config-email.component.html',
  styleUrls: ['./parametros-config-email.component.scss']
})
export class ParametrosConfigEmailComponent implements OnInit {
  @Output() closePanel: EventEmitter<any> = new EventEmitter<any>();
  public emailConfigForm: FormGroup;
  public loading = false;

  constructor(private _parametrizacoesService: ParametrizacoesService,
              private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this._buildForm();
    this._recuperarParametrosEmail();
  }

  submitParametros(): void {
    if (this.emailConfigForm.valid) {
      this.loading = true;
      const parametrosSalvar: ParametrosConfigEmail = this.emailConfigForm.value;
      this._parametrizacoesService
        .salvarEmailConfig(parametrosSalvar)
        .subscribe(resp => {
          console.log(resp);
          this.closePanel.emit();
          this.loading = false;
        }, err => {
          console.error(err);
          this.loading = false;
        });
    }
  }

  private _buildForm() {
    this.emailConfigForm = this._formBuilder
      .group({
        // ParametrosConfigEmail.server
        server: [null, Validators.required],
        // ParametrosConfigEmail.password
        password: [null, Validators.required],
        // ParametrosConfigEmail.port
        port: [null, Validators.required],
        // ParametrosConfigEmail.sender
        sender: [null, Validators.required],
        // ParametrosConfigEmail.tls
        tls: false,
        // ParametrosConfigEmail.username
        username: [null, Validators.required],
      });
  }

  private _recuperarParametrosEmail() {
    this.loading = true;
    this._parametrizacoesService
      .recuperarEmailConfig()
      .subscribe(resp => {
        console.log(resp);
        this.emailConfigForm.setValue({ ...resp });
        this.loading = false;
      }, err => {
        console.error(err);
        this.loading = false;
      });
  }
}
