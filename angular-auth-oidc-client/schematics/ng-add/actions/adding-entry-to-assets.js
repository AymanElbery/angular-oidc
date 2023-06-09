"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSilentRenewHtmlToAssetsArrayInAngularJson = void 0;
const angular_utils_1 = require("../../utils/angular-utils");
function addSilentRenewHtmlToAssetsArrayInAngularJson(ngAddOptions) {
    return (host, context) => {
        var _a, _b, _c;
        if (!ngAddOptions.needsSilentRenewHtml) {
            context.logger.info(`✅️ No silent-renew entry in assets array needed`);
            return host;
        }
        const project = (0, angular_utils_1.getProject)(host);
        const options = (_b = (_a = project.architect) === null || _a === void 0 ? void 0 : _a.build) === null || _b === void 0 ? void 0 : _b.options;
        const srcRoot = project.sourceRoot;
        (_c = options === null || options === void 0 ? void 0 : options.assets) === null || _c === void 0 ? void 0 : _c.push(`${srcRoot}/silent-renew.html`);
        (0, angular_utils_1.updateProjectInAngularJson)(host, project);
        return host;
    };
}
exports.addSilentRenewHtmlToAssetsArrayInAngularJson = addSilentRenewHtmlToAssetsArrayInAngularJson;
//# sourceMappingURL=adding-entry-to-assets.js.map