"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oauth2GrantStrategy = void 0;
require("reflect-metadata");
const strategy_explorer_1 = require("../strategy.explorer");
const Oauth2GrantStrategy = (name) => {
    return (target) => {
        Reflect.defineMetadata(strategy_explorer_1.OAUTH2_STRATEGY_METADATA, name, target);
    };
};
exports.Oauth2GrantStrategy = Oauth2GrantStrategy;
//# sourceMappingURL=oauth2-grant-strategy.decorator.js.map