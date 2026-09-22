"use strict";
const swaggerAutogen = require("swagger-autogen")();
const doc = {
    info: {
        title: "Muthu Vive's API",
        description: "Real Estate Website API",
    },
    // host: "localhost:5001/api",
    // schemes: ["http"],
    host: "muthuvives.skyraantech.com",
    basePath: "/server/api",
    schemes: ["https"],
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
};
const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/routes/index.ts"];
swaggerAutogen(outputFile, endpointsFiles, doc);
