export interface UsuarioDto {
  id: number;
  company: string;
  createdAt: Date;
  email: string;
  lastUpdatedAt: Date;
  name: string;
  profileName: string;
  terminals: string;
  userTypeList: string[];
  active: boolean;
}
