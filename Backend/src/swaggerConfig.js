import swaggerJsdoc  from "swagger-jsdoc";


const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Auth API",
      version: "1.0.0",
      description: "API documentation for authentication routes",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Local server",
      },
      {
        url: "https://api-authentication.herokuapp.com/api",
        description: "Live server",
      },
    ],
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  apis: [
    "./src/routes/*.js"
  ],
};

const specs = swaggerJsdoc(swaggerOptions);

export default specs;
