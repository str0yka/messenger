interface ApiErrorResponse {
  status: number;
  message: string;
  errors: unknown[];
}

type ApiSearchType = 'user' | 'dialog';

type ApiRequestConfig = import('axios').AxiosRequestConfig;

type RequestConfig<Params = undefined> = Params extends undefined
  ? { config?: ApiRequestConfig }
  : { params: Params; config?: ApiRequestConfig };
