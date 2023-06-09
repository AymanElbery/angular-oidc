"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addModuleToImports = void 0;
const ast_utils_1 = require("@schematics/angular/utility/ast-utils");
const angular_utils_1 = require("../../utils/angular-utils");
function addModuleToImports(options) {
    return (host, context) => {
        const project = (0, angular_utils_1.getProject)(host);
        const { moduleFileName, moduleName } = options.moduleInfo;
        const modulesToImport = [
            {
                target: `${project.sourceRoot}/app/app.module.ts`,
                moduleName,
                modulePath: `./auth/${moduleFileName}`,
            },
        ];
        modulesToImport.forEach(({ target, moduleName, modulePath }) => {
            addImport(host, context, moduleName, modulePath, target);
        });
        context.logger.info(`✅️ All imports done, please add the 'RouterModule' as well if you don't have it imported yet.`);
        return host;
    };
}
exports.addModuleToImports = addModuleToImports;
function addImport(host, context, moduleName, source, target) {
    const sourcefile = (0, angular_utils_1.readIntoSourceFile)(host, target);
    const importChanges = (0, ast_utils_1.addImportToModule)(sourcefile, source, moduleName, source);
    importChanges.forEach((insertChange) => {
        const exportRecorder = host.beginUpdate(target);
        exportRecorder.insertLeft(insertChange.pos, insertChange.toAdd);
        host.commitUpdate(exportRecorder);
    });
    context.logger.info(`✅️ '${moduleName}' is imported in '${target}'`);
}
//# sourceMappingURL=add-module-import.js.map