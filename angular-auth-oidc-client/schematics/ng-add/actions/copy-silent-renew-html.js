"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copySilentRenewHtmlToRoot = void 0;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const angular_utils_1 = require("../../utils/angular-utils");
function copySilentRenewHtmlToRoot(options) {
    return (host, context) => {
        if (!options.needsSilentRenewHtml) {
            context.logger.info(`✅️ No 'silent-renew.html' needed`);
            return host;
        }
        const project = (0, angular_utils_1.getProject)(host);
        const templateSource = (0, schematics_1.apply)((0, schematics_1.url)(`./files/silent-renew`), [(0, schematics_1.move)((0, core_1.normalize)(`${project.sourceRoot}`))]);
        return (0, schematics_1.chain)([(0, schematics_1.mergeWith)(templateSource)]);
    };
}
exports.copySilentRenewHtmlToRoot = copySilentRenewHtmlToRoot;
//# sourceMappingURL=copy-silent-renew-html.js.map