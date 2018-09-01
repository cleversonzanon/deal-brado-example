export interface Usuario {
  id: number;
  name: string;
  email: string;
  phone: string;
  profileId: number;
  carrierIdList: number[];
  serviceUnitIdList: number[];
  terminalIdList: number[];
  shipownerIdList: number[];
  clientGroupIdList: number[];
}
