import { Autorizacao } from './autorizacao';

export interface Funcionalidade {
  name: string;
  authorizationList: Autorizacao[];
}
