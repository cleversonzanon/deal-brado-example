import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-perfil-erro',
  templateUrl: './perfil-erro.component.html',
  styleUrls: ['./perfil-erro.component.scss']
})
export class PerfilErroComponent {
  @Output() clickVoltar: EventEmitter<any> = new EventEmitter<any>();

  onClickVoltar(event: Event): void {
    event.stopPropagation();
    this.clickVoltar.emit();
  }
}
