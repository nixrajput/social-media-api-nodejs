export interface IListResponse<T> {
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
  totalItems: number;
  results: T[];
}
