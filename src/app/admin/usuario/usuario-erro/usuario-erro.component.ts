import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-usuario-erro',
  templateUrl: './usuario-erro.component.html',
  styleUrls: ['./usuario-erro.component.scss']
})
export class UsuarioErroComponent {

  @Output() clickVoltar: EventEmitter<any> = new EventEmitter<any>();

  onClickVoltar(event: Event): void {
    event.stopPropagation();
    this.clickVoltar.emit();
  }

}
