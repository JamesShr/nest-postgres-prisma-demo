export interface PagingData<T> {
  data: T[];
  paging: {
    page?: number;
    limit?: number;
    totalCount: number;
    totalPages: number;
  };
}
