const config = {
  development: {
    username: "root",
    password: "Welcome00",
    database: "pangeamt_development",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  test: {
    username: "root",
    password: null,
    database: "pangeamt_test",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: "root",
    password: "epastor",
    database: "pangeamt_production",
    host: "prod.pangeamt.com",
    dialect: "mysql"
  },
  apiKey: "cOrtesvalenc1anas",
  secret: "pangeamt-super-secret-key"
}

export default config;