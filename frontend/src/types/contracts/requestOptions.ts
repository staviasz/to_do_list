export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: { [key: string]: string };
  body?: any;
}
