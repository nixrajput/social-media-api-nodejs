/**
 * Define EnvConfig interface
 */

export interface IEnvConfig {
  PORT: number | undefined;
  NODE_ENV: string | undefined;
  SERVER_MAINTENANCE: boolean | undefined;

  MONGO_URI: string | undefined;
  DB_NAME: string | undefined;

  API_PREFIX: string | undefined;

  CORS_ENABLED: boolean | undefined;
  LOG_DAYS: number | undefined;

  JWT_SECRET: string | undefined;
  JWT_EXPIRES_IN: string | undefined;

  SENDGRID_API_KEY: string | undefined;
  SMTP_FROM: string | undefined;

  CLOUDINARY_CLOUD_NAME: string | undefined;
  CLOUDINARY_API_KEY: string | undefined;
  CLOUDINARY_API_SECRET: string | undefined;
}

/**
 * Define FirebaseConfig interface
 */
export interface IFirebaseConfig {
  FIREBASE_TYPE: string | undefined;
  FIREBASE_PROJECT_ID: string | undefined;
  FIREBASE_PRIVATE_KEY_ID: string | undefined;
  FIREBASE_PRIVATE_KEY: string | undefined;
  FIREBASE_CLIENT_EMAIL: string | undefined;
  FIREBASE_CLIENT_ID: string | undefined;
  FIREBASE_AUTH_URI: string | undefined;
  FIREBASE_TOKEN_URI: string | undefined;
  FIREBASE_AUTH_PROVIDER_X509_CERT_URL: string | undefined;
  FIREBASE_CLIENT_X509_CERT_URL: string | undefined;
}
