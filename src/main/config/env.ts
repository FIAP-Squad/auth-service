export default {
  PORT: process.env.PORT,
  RABBIT_MQ: {
    HOST_NAME: process.env.RABBIT_MQ_HOST_NAME,
    PORT: process.env.RABBIT_MQ_PORT,
    USERNAME: process.env.RABBIT_MQ_USERNAME,
    PASSWORD: process.env.RABBIT_MQ_PASSWORD
  },
  MYSQL: {
    URL: process.env.MYSQL_URL
  },
  MONGODB: {
    URL: process.env.MONGODB_URL,
    DATABASE: process.env.MONGODB_DATABASE
  },
  AWS: {
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY
  }
}

console.log({
  PORT: process.env.PORT,
  RABBIT_MQ: {
    HOST_NAME: process.env.RABBIT_MQ_HOST_NAME,
    PORT: process.env.RABBIT_MQ_PORT,
    USERNAME: process.env.RABBIT_MQ_USERNAME,
    PASSWORD: process.env.RABBIT_MQ_PASSWORD
  },
  MONGODB: {
    URL: process.env.MONGODB_URL,
    DATABASE: process.env.MONGODB_DATABASE
  },
  AWS: {
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY
  }
}
)
