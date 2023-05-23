"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAngularJsonContent = exports.getDefaultProjectName = exports.readIntoSourceFile = exports.getProject = exports.updateProjectInAngularJson = exports.getAngularWorkspace = exports.ANGULAR_JSON_FILENAME = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const ts = require("@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript");
exports.ANGULAR_JSON_FILENAME = 'angular.json';
function getAngularWorkspace(tree) {
    const workspaceContent = getAngularJsonContent(tree);
    const workspace = JSON.parse(workspaceContent);
    return workspace;
}
exports.getAngularWorkspace = getAngularWorkspace;
function updateProjectInAngularJson(tree, content, projectName) {
    projectName = projectName || getDefaultProjectName(tree);
    if (!projectName) {
        throw new schematics_1.SchematicsException(`Could not Update Project in Angular.json because no project name was found.`);
    }
    const workspaceContent = getAngularJsonContent(tree);
    const workspace = JSON.parse(workspaceContent);
    workspace['projects'][projectName] = content;
    tree.overwrite(exports.ANGULAR_JSON_FILENAME, JSON.stringify(workspace, null, 2));
}
exports.updateProjectInAngularJson = updateProjectInAngularJson;
function getProject(tree, projectName) {
    const workspace = getAngularWorkspace(tree);
    const defaultProject = getDefaultProjectName(tree);
    if (!!projectName) {
        return workspace.projects[projectName] || null;
    }
    else if (!!defaultProject) {
        return workspace.projects[defaultProject];
    }
    throw new schematics_1.SchematicsException(`Could not get project. Searched for '${projectName}',
        but it could not be found and no default project is given in workspace - ${JSON.stringify(workspace.projects, null, 2)}`);
}
exports.getProject = getProject;
function readIntoSourceFile(host, fileName) {
    const buffer = host.read(fileName);
    if (buffer === null) {
        throw new schematics_1.SchematicsException(`File ${fileName} does not exist.`);
    }
    return ts.createSourceFile(fileName, buffer.toString('utf-8'), ts.ScriptTarget.Latest, true);
}
exports.readIntoSourceFile = readIntoSourceFile;
function getDefaultProjectName(tree) {
    const workspace = getAngularWorkspace(tree);
    const allProjects = Object.keys(workspace.projects);
    return workspace.defaultProject || allProjects[0];
}
exports.getDefaultProjectName = getDefaultProjectName;
function getAngularJsonContent(tree) {
    const workspaceConfig = tree.read(exports.ANGULAR_JSON_FILENAME);
    if (!workspaceConfig) {
        throw new schematics_1.SchematicsException('Could not find Angular workspace configuration');
    }
    return workspaceConfig.toString();
}
exports.getAngularJsonContent = getAngularJsonContent;
//# sourceMappingURL=angular-utils.js.map