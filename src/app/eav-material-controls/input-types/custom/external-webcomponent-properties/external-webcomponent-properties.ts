import { TranslateService } from '@ngx-translate/core';
import { ConnectorObservable } from '../../../../../../projects/shared/connector';

export class ExternalWebComponentProperties<T> {
    connector: ConnectorObservable<T>;
    hiddenProps: HiddenProps;
    id: string;
    form: any;
    host: any;
    translateService: TranslateService;

    value: any;
    disabled: boolean;
    // options: any

    adamSetValueCallback: any;
    adamAfterUploadCallback: any;
    // dnnBridgeprocessResult: any;
}

export class HiddenProps {
    allInputTypeNames: string[];
}
