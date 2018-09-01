export interface Pagination<T> {
  content: T[];
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: object;
  size: number;
  sort: object;
  totalElements: number;
  totalPages: number;
}
