export function errorCodeMessage(code: number) {
  switch (code) {
    case 400:
      return 'Bad Request';
    case 401:
      return 'Unauthorized';
    case 402:
      return 'Payment Required';
    case 403:
      return 'Forbidden';
    case 404:
      return 'Not Found';
    case 405:
      return 'Method Not Allowed';
    case 406:
      return 'Not Acceptable';
    case 407:
      return 'Proxy Authentication Required';
    case 408:
      return 'Request Timeout';
    case 409:
      return 'Conflict';
    default:
      return 'Internal Server Error';
  }
}
