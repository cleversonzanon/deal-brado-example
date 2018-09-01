import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { trigger } from '@angular/animations';
import { Animations } from '../../../shared/util/animations';


export enum ModalType {
  HEADER_PERFIL = 'header_perfil',
  HEADER_USUARIO = 'header_usuario'
}

@Component({
  selector: 'app-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss'],
  animations: [
    trigger('slideInOut', Animations.slideInOut)
  ]
})
export class ModalHeaderComponent implements OnInit {
  ModalType = ModalType;
  @Input() showLogo = false;
  @Input() tipoHeaderModal: ModalType = ModalType.HEADER_PERFIL;
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();

  logoImgHeader = {
    [ModalType.HEADER_PERFIL]: '../../../../assets/background-imagens/perfil/user-brado2.png',
    [ModalType.HEADER_USUARIO]: '../../../../assets/background-imagens/usuario/user-brado.png'
  };

  onClickCloseModal(event: Event): void {
    event.stopPropagation();
    this.closeModal.emit();
  }

  ngOnInit(): void {

  }

}
