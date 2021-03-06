export const prefix = 'eav-';
export const keyZoneId = prefix + 'zoneId';
export const keyRequestToken = prefix + 'rvt';
export const keyTabId = prefix + 'tid';
export const keyContentBlockId = prefix + 'cbid';
export const keyModuleId = prefix + 'mid';
export const keyAppId = prefix + 'appId';
export const keyDebug = prefix + 'debug';
export const keyDialog = prefix + 'dialog';
export const keyContentType = prefix + 'contentType';
export const keyItems = prefix + 'items';
export const keyPartOfPage = prefix + 'partOfPage';
// 2020-12-01 2dm - not in url any more in 2sxc 11.10.02+, remove this
// Keep in this comment in till January 2021 in case something breaks
// the commit where this was added contains all the changes related to this
// export const keyPortalRoot = prefix + 'portalroot';
export const keyPublishing = prefix + 'publishing';
export const keyFilters = prefix + 'filters';
export const keyPipelineId = prefix + 'pipelineId';
export const keyApi = prefix + 'api';

/** Url which opened the dialog. Used for debugging */
export const keyUrl = prefix + 'url';

/** This is used by file editor to determine if it's editing shared files or of that portal only */
export const keyIsShared = prefix + 'isshared';
