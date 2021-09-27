"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = void 0;
const axios_1 = __importDefault(require("axios"));
const ApiClient = (url) => ({
    service: () => {
        return {
            call: async (path, method, parameters) => {
                const fullPath = `${url}${path}`;
                const methodName = method.toLowerCase();
                const response = await axios_1.default[methodName](fullPath, parameters);
                if (response.status === 200) {
                    return response.data;
                }
                else {
                    throw new Error();
                }
            }
        };
    }
});
exports.ApiClient = ApiClient;
