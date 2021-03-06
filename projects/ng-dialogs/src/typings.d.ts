/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

/**
 * We need this for import json file in code
 */
declare module "*.json" {
  const value: any;
  export default value;
}

declare module '!raw-loader!*' {
  const contents: string;
  export default contents;
}

declare module '!url-loader!*' {
  const urlLoaderContents: string;
  export default urlLoaderContents;
}
