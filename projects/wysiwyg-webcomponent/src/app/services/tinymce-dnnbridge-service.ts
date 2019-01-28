import { Injectable } from '@angular/core';

@Injectable()
export class TinyMceDnnBridgeService {
    attachDnnBridgeService(vm, editor) {
        // const editor = editor;
        const result: any = {};
        // open the dialog - note: strong dependency on the buttons, not perfect here
        vm.openDnnDialog = (type) => {
            console.log('attachDnnBridgeService openDnnDialog called');
            vm.host.openDnnDialog('', { Paths: null, FileFilter: null }, vm.processResultOfDnnBridge);
        };

        // the callback when something was selected
        vm.processResultOfDnnBridge = (value) => {
            // const result = value;
            if (!value) { return; }
            console.log('call getUrlOfIdDnnDialog', 'page:' + (value.id || value.FileId));
            vm.host.getUrlOfIdDnnDialog('page:' + (value.id || value.FileId), vm.urlCallback);

            //  return value;
            // $scope.$apply(function () {
            //     if (!value) return;

            //     var previouslySelected = vm.editor.selection.getContent();

            //     var promise = dnnBridgeSvc.getUrlOfId("page:" + (value.id || value.FileId)); // id on page, FileId on file
            //     return promise.then(function (result) {
            //         vm.editor.insertContent("<a href=\"" + result.data + "\">" + (previouslySelected || value.name) + "</a>");
            //     });
            // });
        };

        vm.urlCallback = (data) => {
            const previouslySelected = editor.selection.getContent();
            editor.insertContent('<a href=\"' + data + '\">' + (previouslySelected || result.name) + '</a>');
        };
    }
}
