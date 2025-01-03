export type PaginatedResponse<T> = {
  totalRecords: number;
  items: T[];
}