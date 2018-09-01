import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CepPipe } from './cep.pipe';
import { CpfCnpjPipe } from './cpf-cnpj.pipe';
import { EllipsisPipe } from './ellipsis.pipe';
import { InitialsPipe } from './initials.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CepPipe,
    CpfCnpjPipe,
    EllipsisPipe,
    InitialsPipe
  ],
  exports: [
    EllipsisPipe,
    InitialsPipe
  ]
})
export class PipesModule {
}
