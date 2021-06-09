import { join, normalize, strings } from '@angular-devkit/core';
import { apply, chain, MergeStrategy, mergeWith, move, Rule, SchematicContext, template, Tree, url } from '@angular-devkit/schematics';
import { parseName } from '@schematics/angular/utility/parse-name';
import { buildDefaultPath, getWorkspace } from '@schematics/angular/utility/workspace';

export function myFirstSchematics(_options: any): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    let workspace, project, defaultProjectPath;
    try {
      workspace = await getWorkspace(tree);
      if (!_options.project) {
        _options.project = workspace.projects.keys().next().value;
      }
      project = workspace.projects.get(_options.project);
      defaultProjectPath = buildDefaultPath(project);
      _options.path = join(normalize(project.root), 'src');
    } catch (error) {
      if (!_options.path) {
        _options.path = '/src/';
      }
      defaultProjectPath = _options.path;
    }

    const parsedPath = parseName(defaultProjectPath, _options.name);
    const { name, path } = parsedPath;
    const sourceTemplate = url('./files');
    const templateSource = apply(sourceTemplate, [
      template({ ..._options, ...strings, name, 自我介绍 }),
      move(path)
    ]);

    return chain([mergeWith(templateSource, MergeStrategy.Overwrite)]);
  };
}


function 自我介绍(name: string, sex: string, food: string) {
  return `my name is ${name}, is ${sex ? 'boy' : 'girl'},the food is ${food}`;
}