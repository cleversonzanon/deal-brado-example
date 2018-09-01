import { AbstractControl, ValidatorFn } from '@angular/forms';

export class ImageValidator {

  static width( expectedWidth: number ): ValidatorFn {
    return ( control: AbstractControl ): { [ key: string ]: any } => {
      // Erro
      const error = { [ 'width' ]: true };
      // Se não existe o valor, retorna o erro
      if ( !control.value ) {
        return error;
      }
      // Instancia o file reader
      const reader = new FileReader();
      let width = 0;
      // Reader listener
      reader.onload = () => {
        // Imagem
        const image = new Image();
        // Imagem listener
        image.onload = () => {
          // Set width
          width = image.width;
        };
        // Atribui o source da imagem, disparando o listener
        image.src = reader.result;
      };
      // Le o arquivo como base64, disparando o listener
      reader.readAsDataURL( control.value );
      // Se diferente do esperado, retorna o erro
      if ( width !== expectedWidth ) {
        return error;
      }
      return null;
    };
  }

  static height( expectedHeight: number ): ValidatorFn {
    return ( control: AbstractControl ): { [ key: string ]: any } => {
      // Erro
      const error = { [ 'height' ]: true };
      // Se não existe o valor, retorna o erro
      if ( !control.value ) {
        return error;
      }
      // Instancia o file reader
      const reader = new FileReader();
      let height = 0;
      // Reader listener
      reader.onload = () => {
        // Imagem
        const image = new Image();
        // Imagem listener
        image.onload = () => {
          // Set width
          height = image.height;
        };
        // Atribui o source da imagem, disparando o listener
        image.src = reader.result;
      };
      // Le o arquivo como base64, disparando o listener
      reader.readAsDataURL( control.value );
      // Se diferente do esperado, retorna o erro
      if ( height !== expectedHeight ) {
        return error;
      }
      return null;
    };
  }

  static size( allowedSize: number ): ValidatorFn {
    return ( control: AbstractControl ): { [ key: string ]: any } => {
      const error = { [ 'size' ]: true };
      if ( !control.value ) {
        return error;
      }
      const fileSize = control.value.size / ( 1024 * 1024 );
      if ( fileSize > allowedSize ) {
        return error;
      }
      return null;
    };
  }

  static format(): ValidatorFn {
    return ( control: AbstractControl ): { [ key: string ]: any } => {
      // Erro
      const error = { [ 'format' ]: true };
      // Se não existe o valor, retorna o erro
      if ( !control.value ) {
        return error;
      }
      const fileType = control.value.type;
      if ( !( fileType === 'image/jpeg' || fileType === 'image/png' ) ) {
        return error;
      }
      return null;
    };
  }
}
