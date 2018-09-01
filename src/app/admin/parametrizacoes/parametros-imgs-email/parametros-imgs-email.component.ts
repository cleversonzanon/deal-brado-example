import { Component, OnInit } from '@angular/core';
import { ImagemParametrizada } from '../../domains/imagem-parametrizada';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ParametrizacoesService } from '../parametrizacoes.service';
import { Imagem } from '../../domains/enum/imagem';
import { ImageValidator } from '../image.validator';

@Component( {
  selector: 'app-parametros-imgs-email',
  templateUrl: './parametros-imgs-email.component.html',
  styleUrls: [ './parametros-imgs-email.component.scss' ]
} )
export class ParametrosImgsEmailComponent implements OnInit {

  emailCadastroFile: File;
  emailResetSenhaFile: File;

  imagemEmailForm: FormGroup;

  constructor( private _formBuilder: FormBuilder,
               private _paramService: ParametrizacoesService ) {
  }

  ngOnInit(): void {
    this.imagemEmailForm = this._formBuilder.group( {
      cadastro: [ null, [ ImageValidator.size( 10 ), ImageValidator.format ] ],
      resetSenha: [ null, [ ImageValidator.size( 10 ), ImageValidator.format ] ]
    } );
  }

  submit(): void {
    console.log( this.imagemEmailForm );
    const imagens: Array<ImagemParametrizada> = [];
  }

  _readImage( image: File, type: Imagem ): ImagemParametrizada {
    const reader = new FileReader();
    let result: ImagemParametrizada = null;

    reader.onload = () => {
      result = {
        stream: reader.result.split( ',' )[ 1 ],
        imageType: type
      };
    };
    reader.readAsDataURL( image );
    return result;
  }
}
