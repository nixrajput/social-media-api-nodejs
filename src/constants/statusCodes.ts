/**
 * Define API's Status Codes
 */

class StatusCodes {
  public static CONTINUE: number = 100;
  public static SWITCHING_PROTOCOLS: number = 101;
  public static PROCESSING: number = 102;
  public static EARLY_HINTS: number = 103;

  public static OK: number = 200;
  public static CREATED: number = 201;
  public static ACCEPTED: number = 202;
  public static NON_AUTHORITATIVE_INFORMATION: number = 203;
  public static NO_CONTENT: number = 204;
  public static RESET_CONTENT: number = 205;
  public static PARTIAL_CONTENT: number = 206;
  public static MULTI_STATUS: number = 207;
  public static ALREADY_REPORTED: number = 208;
  public static I_M_USED: number = 226;

  public static MULTIPLE_CHOICES: number = 300;
  public static MOVED_PERMANENTLY: number = 301;
  public static MOVED_TEMPORARILY: number = 302;
  public static SEE_OTHER: number = 303;
  public static NOT_MODIFIED: number = 304;
  public static USE_PROXY: number = 305;
  public static TEMPORARY_REDIRECT: number = 307;
  public static PERMANENT_REDIRECT: number = 308;

  public static BAD_REQUEST: number = 400;
  public static UNAUTHORIZED: number = 401;
  public static PAYMENT_REQUIRED: number = 402;
  public static FORBIDDEN: number = 403;
  public static NOT_FOUND: number = 404;
  public static METHOD_NOT_ALLOWED: number = 405;
  public static NOT_ACCEPTABLE: number = 406;
  public static PROXY_AUTHENTICATION_REQUIRED: number = 407;
  public static REQUEST_TIMEOUT: number = 408;
  public static CONFLICT: number = 409;
  public static GONE: number = 410;
  public static LENGTH_REQUIRED: number = 411;
  public static PRECONDITION_FAILED: number = 412;
  public static PAYLOAD_TOO_LARGE: number = 413;
  public static URI_TOO_LARGE: number = 414;
  public static UNSUPPORTED_MEDIA_TYPE: number = 415;
  public static REQUESTED_RANGE_NOT_SATISFIABLE: number = 416;
  public static EXPECTATION_FAILED: number = 417;
  public static I_M_A_TEAPOT: number = 418;
  public static INSUFFICIENT_SPACE_ON_RESOURCE: number = 419;
  public static METHOD_FAILURE: number = 420;
  public static MISDIRECTED_REQUEST: number = 421;
  public static UNPROCESSABLE_ENTITY: number = 422;
  public static LOCKED: number = 423;
  public static FAILED_DEPENDENCY: number = 424;
  public static TOO_EARLY: number = 425;
  public static UPGRADE_REQUIRED: number = 426;
  public static PRECONDITION_REQUIRED: number = 428;
  public static TOO_MANY_REQUESTS: number = 429;
  public static REQUEST_HEADER_FIELDS_TOO_LARGE: number = 431;
  public static UNAVAILABLE_FOR_LEGAL_REASONS: number = 451;
  public static CLIENT_CLOSED_REQUEST: number = 499;

  public static INTERNAL_SERVER_ERROR: number = 500;
  public static NOT_IMPLEMENTED: number = 501;
  public static BAD_GATEWAY: number = 502;
  public static SERVICE_UNAVAILABLE: number = 503;
  public static GATEWAY_TIMEOUT: number = 504;
  public static HTTP_VERSION_NOT_SUPPORTED: number = 505;
  public static INSUFFICIENT_STORAGE: number = 507;
  public static LOOP_DETECTED: number = 508;
  public static NOT_EXTENDED: number = 510;
  public static NETWORK_AUTHENTICATION_REQUIRED: number = 511;
  public static NETWORK_CONNECTION_TIMEOUT_ERROR: number = 599;
}

export default StatusCodes;
