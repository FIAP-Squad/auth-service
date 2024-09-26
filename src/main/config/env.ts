export default {
  PORT: process.env.PORT,
  DOCTORS_SERVICE: process.env.DOCTORS_SERVICE,
  PATIENTS_SERVICE: process.env.PATIENTS_SERVICE,
  MY_SQL: {},
  MONGODB: {
    URL: process.env.MONGODB_URL,
    DATABASE: process.env.MONGODB_DATABASE
  },
  AWS: {
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
    COGNITO: {
      CLIENT_ID: process.env.CLIENT_ID,
      USER_POOL_ID: process.env.USER_POOL_ID
    },
    AMAZON_MQ: {
      HOST_NAME: process.env.HOST_NAME,
      PORT: process.env.PORT,
      USER: process.env.USER,
      PASSWORD: process.env.PASSWORD
    }
  }
}
