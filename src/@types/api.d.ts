interface ApiErrorResponse {
  status: number;
  message: string;
  errors: unknown[];
}

type ApiSearchType = 'user' | 'dialog';
