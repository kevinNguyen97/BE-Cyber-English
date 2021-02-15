import swaggerUI from "swagger-ui-express";
import { ISwaggerTag } from "../interfaces/Swagger.interface";

class SwaggerDefinitions {
    LoginRequestBody = {
        type: "object",
        properties: {
            username: { type: 'string' },
            password: { type: 'string' }

        }
    };

    LoginResponses = {
        type: "object",
        properties: {
            id: { type: 'number' },
            display_name: { type: 'string' },
            user_email: { type: 'string' }
        }
    };
}

// tslint:disable-next-line: max-classes-per-file
class SwaggerModel implements swaggerUI.JsonObject {
    readonly swagger = "2.0";
    readonly info = {
        version: "1.0.0",
        title: "My API"

    };
    tags: ISwaggerTag[] = [
    ];
    readonly consumes = ["application/json"];
    readonly produces = ["application/json"]
    paths = {
    }
    definitions = new SwaggerDefinitions()
}
const swaggerModel = new SwaggerModel()
export default swaggerModel;