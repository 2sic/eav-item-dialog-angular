import tinymceWysiwygConfig from './tinymce-wysiwyg-config.js'
import { addTinyMceToolbarButtons } from './tinymce-wysiwyg-toolbar.js'
import { attachAdam } from './tinymce-adam-service.js'

(function () {

    class externalTinymceWysiwyg {

        constructor(name, id, host, options, form, config) {
            this.name = name;
            this.id = id;
            this.host = host;
            this.options = options;
            this.form = form;
            this.config = config;

            this.adam;
        }

        initialize(host, options, form, id) {
            // if (!this.host) {
            //     this.host = {};
            // }
            this.host = host;
            this.options = options;
            this.form = form;
            this.id = id;
            // this.options = somethingWithCallbacks.options;
            console.log('myComponent initialize', this.host);

            // Attach adam
            attachAdam(this);
            // Set Adam configuration
            this.setAdamConfig({
                adamModeConfig: { usePortalRoot: false },
                allowAssetsInRoot: true,
                autoLoad: false,
                enableSelect: true,
                folderDepth: 0,
                fileFilter: '',
                metadataContentTypes: '',
                subFolder: '',
                showImagesOnly: false  //adamModeImage?
            });
        }

        render(container) {
            // <div id="fixed-editor-toolbar` + this.id + `"></div>
            container.innerHTML = `<div class="wrap-float-label" style="height:100% !important">
            <textarea id="` + this.id + `" class="field-string-wysiwyg-mce-box"></div>
            </textarea>
            <span id="dummyfocus" tabindex="-1"></span>`;



            var settings = {
                enableContentBlocks: false,
                // auto_focus: false,
            };

            //TODO: add languages
            // angular.extend($scope.tinymceOptions, {
            //     language: lang2,
            //     language_url: "../i18n/lib/tinymce/" + lang2 + ".js"
            // });

            var selectorOptions = {
                selector: 'textarea#' + this.id,
                body_class: 'field-string-wysiwyg-mce-box', // when inline=false
                content_css: 'assets/script/tinymce-wysiwyg/src/tinymce-wysiwyg.css',
                height: '100%',
                branding: false,
                // fixed_toolbar_container: '#fixed-editor-toolbar' + this.id,
                //init_instance_callback: this.tinyMceInitCallback
                setup: this.tinyMceInitCallback.bind(this),
            };

            this.enableContentBlocksIfPossible(settings);
            var options = Object.assign(selectorOptions, this.config.getDefaultOptions(settings));

            // check if it's an additionally translated language and load the translations
            var lang2 = 'es'; //  /* "de" */ languages.currentLanguage.substr(0, 2);
            if (this.config.svc().languages.indexOf(lang2) >= 0) {
                options = Object.assign(options, {
                    language: lang2,
                    language_url: "/DesktopModules/ToSIC_SexyContent/dist/i18n/lib/tinymce/" + lang2 + ".js"
                });
            }


            tinymce.init(options);
        }

        /**
         * function call on change
         * @param {*} event 
         * @param {*} value 
         */
        changeCheck(event, value) {
            // do validity checks
            var isValid = this.validateValue(value);
            if (isValid) {
                this.host.update(value);
            }
        }

        /**
         * For validating value
         * @param {*} value 
         */
        validateValue(value) {
            // if (value.length < 3) {
            //     return false;
            // }
            //TODO: show validate message ???
            return true;
        }

        /**
         * On render and change set configuration of control
         * @param {*} container - is html container for component
         * @param {*} disabled 
         */
        setOptions(container, disabled) {
            console.log('set disable 1', tinymce.get(this.id));

            var isReadOnly = tinymce.get(this.id).readonly;
            if (disabled && !isReadOnly) {
                tinymce.get(this.id).setMode('readonly');
            }
            else if (!disabled && isReadOnly) {
                tinymce.get(this.id).setMode('code');
            }

            //  document.scrollTop();
        }

        /**
         * New value from the form into the view
         * This function can be triggered from outside when value changed
         * @param {} container 
         * @param {*} newValue 
         */
        setValue(container, newValue) {
            // var elements = container.getElementsByTagName('div');
            // console.log('Exernal outside valu:', elements[1].innerHTML);
            // console.log('Exernal outside newvalue:', newValue);
            // if (elements[1].innerHTML !== newValue)
            //     elements[1].innerHTML = newValue;
            console.log('setValue', this.id);
            var oldValue = tinymce.get(this.id).getContent();
            if (newValue !== oldValue) {
                tinymce.get(this.id).setContent(newValue);
            }
        }

        // isDirty() {
        //     return tinymce.get(this.id).isDirty();
        // }

        /**
         * on tinyMce setup we set toolbarButtons and change event listener
         * @param {*} editor 
         */
        tinyMceInitCallback(editor) {
            console.log("Editor1: " + editor.id + " is now initialized.");
            console.log("Editor host: ", this.host);
            var imgSizes = this.config.svc().imgSizes;
            addTinyMceToolbarButtons(this, editor, imgSizes);

            editor.on('init', e => {
                // console.log('Editor was init');
                // editor.selection.select(editor.getBody(), true);
                // editor.selection.collapse(false);

                this.host.setInitValues();
            });

            editor.on('change', e => {
                console.log('Editor was change', editor.getContent());
                this.changeCheck(e, editor.getContent())
            });

            // This prevents the blur event from hiding the toolbar - inline mode
            // editor.on('blur', function () {
            //     return false;
            // });
        }

        enableContentBlocksIfPossible(settings) {
            // quit if there are no following fields
            if (Object.keys(this.form.controls).length === this.options.index + 1) {
                return;
            }
            var key = Object.keys(this.form.controls)[this.options.index + 1];
            var nextField = this.form.controls[key];
            console.log('enableContentBlocksIfPossible: ', nextField);
            console.log('enableContentBlocksIfPossible: ', this.options);
            if (nextField.type === 'entity-content-blocks') {
                console.log('enableContentBlocksIfPossible:success');
                settings.enableContentBlocks = true;
            }
        }
    }

    function externalComponentFactory(name) {
        var config = new tinymceWysiwygConfig();
        return new externalTinymceWysiwyg(name, null, null, null, null, config);
    }

    window.addOn.register(externalComponentFactory('tinymce-wysiwyg'));
})();