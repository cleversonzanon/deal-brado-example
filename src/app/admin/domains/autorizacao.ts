export interface Autorizacao {
  id: number;
  name: string;
  activate: boolean;
  authorizationChildrenList: Autorizacao[];
}
