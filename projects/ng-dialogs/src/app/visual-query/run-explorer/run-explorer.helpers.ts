import { Context } from '../../shared/services/context';

/**
 * Check if there are special warnings the developer should know.
 * Typically when the test-module-id is different from the one we're currently
 * working on, or if no test-module-id is provided
 */
export function calculateWarnings(pipelineData: any, context: Context): any[] {
  const warnings = [];

  try { // catch various not-initialized errors
    const regex = /^\[module:moduleid\]=([0-9]*)$/gmi; // capture the mod-id
    const testParams = pipelineData.Pipeline.TestParameters;
    const matches = regex.exec(testParams);
    const testMid = matches[1];
    const urlMid = context.moduleId.toString();
    if (testMid !== urlMid) {
      // tslint:disable-next-line:max-line-length
      warnings.push(`Your test moduleid (${testMid}) is different from the current moduleid (${urlMid}). Note that 2sxc 9.33 automatically provides the moduleid - so you usually do not need to set it any more.`);
    }
  } catch (error) { }

  return warnings;
}