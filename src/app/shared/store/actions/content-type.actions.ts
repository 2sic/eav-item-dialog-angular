import { Action } from '@ngrx/store';

import { ContentType } from '../../models/eav';

export const LOAD_CONTENT_TYPE = 'LOAD_CONTENT_TYPE';
export const LOAD_CONTENT_TYPE_SUCCESS = 'LOAD_CONTENT_TYPE_SUCCESS';

export class LoadContentTypeAction implements Action {
    readonly type = LOAD_CONTENT_TYPE;

    constructor(public path: string) { }
}

export class LoadContentTypeSuccessAction implements Action {
    readonly type = LOAD_CONTENT_TYPE_SUCCESS;

    constructor(public newContentType: ContentType) {
    }
}

export type Actions
    = LoadContentTypeAction
    | LoadContentTypeSuccessAction;
