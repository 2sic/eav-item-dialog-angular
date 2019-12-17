import { loadCustomIcons } from './load-icons-helper';
import { MathHelper } from './math-helper';

export function addTinyMceToolbarButtons(fieldStringWysiwyg: any, editor: any, expand: (expand: boolean) => void) {
  const imgSizes = [100, 75, 70, 66, 60, 50, 40, 33, 30, 25, 10];
  registerTinyMceFormats(editor, imgSizes);
  loadCustomIcons(editor);

  // Group with adam-link, dnn-link
  editor.ui.registry.addSplitButton('linkfiles', {
    icon: 'custom-file-pdf',
    tooltip: 'Link.AdamFile.Tooltip',
    presets: 'listpreview',
    columns: 3,
    onAction: (_: any) => {
      fieldStringWysiwyg.toggleAdam(false);
    },
    onItemAction: (api: any, value: any) => {
      value(api);
    },
    fetch: (callback: any) => {
      const items = [
        {
          type: 'choiceitem',
          text: 'Link.AdamFile.Tooltip',
          tooltip: 'Link.AdamFile.Tooltip',
          icon: 'custom-file-pdf',
          value: (api: any) => { fieldStringWysiwyg.toggleAdam(false); },
        },
        {
          type: 'choiceitem',
          text: 'Link.DnnFile.Tooltip',
          tooltip: 'Link.DnnFile.Tooltip',
          icon: 'custom-file-dnn',
          value: (api: any) => { fieldStringWysiwyg.toggleAdam(false, true); },
        },
      ];
      callback(items);
    },
  });

  // Link group with web-link, page-link, unlink, anchor
  const linkButton = editor.ui.registry.getAll().buttons.link;
  const linkgroupItems = [
    {
      ...linkButton,
      type: 'choiceitem',
      text: linkButton.tooltip,
      value: (api: any) => { editor.execCommand('mceLink'); },
    },
    {
      type: 'choiceitem',
      text: 'Link.Page.Tooltip',
      tooltip: 'Link.Page.Tooltip',
      icon: 'custom-sitemap',
      value: (api: any) => { fieldStringWysiwyg.openDnnDialog('pagepicker'); },
    },
  ];
  const linkgroupProItems = [...linkgroupItems];
  linkgroupProItems.push({
    type: 'choiceitem',
    text: 'Link.Anchor.Tooltip',
    tooltip: 'Link.Anchor.Tooltip',
    icon: 'custom-anchor',
    value: (api: any) => { editor.execCommand('mceAnchor'); },
  });
  const linkgroup = {
    ...linkButton,
    presets: 'listpreview',
    columns: 3,
    onItemAction: (api: any, value: any) => {
      value(api);
    },
    fetch: (callback: any) => {
      callback(linkgroupItems);
    },
  };
  const linkgroupPro = { ...linkgroup };
  linkgroupPro.fetch = (callback: any) => {
    callback(linkgroupProItems);
  };
  editor.ui.registry.addSplitButton('linkgroup', linkgroup);
  editor.ui.registry.addSplitButton('linkgrouppro', linkgroupPro);

  const imageButton = editor.ui.registry.getAll().buttons.image;
  const alignleftButton = editor.ui.registry.getAll().buttons.alignleft;
  const aligncenterButton = editor.ui.registry.getAll().buttons.aligncenter;
  const alignrightButton = editor.ui.registry.getAll().buttons.alignright;
  // Group with images (adam) - only in PRO mode
  editor.ui.registry.addSplitButton('images', {
    ...imageButton,
    tooltip: 'Image.AdamImage.Tooltip',
    presets: 'listpreview',
    columns: 3,
    onAction: (_: any) => {
      fieldStringWysiwyg.toggleAdam(true);
    },
    onItemAction: (api: any, value: any) => {
      value(api);
    },
    fetch: (callback: any) => {
      const items = [
        {
          ...imageButton,
          type: 'choiceitem',
          text: 'Image.AdamImage.Tooltip',
          tooltip: 'Image.AdamImage.Tooltip',
          value: (api: any) => { fieldStringWysiwyg.toggleAdam(true); },
        },
        {
          type: 'choiceitem',
          text: 'Image.DnnImage.Tooltip',
          tooltip: 'Image.DnnImage.Tooltip',
          icon: 'custom-image-dnn',
          value: (api: any) => { fieldStringWysiwyg.toggleAdam(true, true); },
        },
        // note: all these use i18n from tinyMce standard
        {
          ...imageButton,
          type: 'choiceitem',
          text: imageButton.tooltip,
          icon: 'link',
          value: (api: any) => { editor.execCommand('mceImage'); },
        },
        {
          ...alignleftButton,
          type: 'choiceitem',
          text: alignleftButton.tooltip,
          value: (api: any) => { editor.execCommand('JustifyLeft'); },
        },
        {
          ...aligncenterButton,
          type: 'choiceitem',
          text: aligncenterButton.tooltip,
          value: (api: any) => { editor.execCommand('JustifyCenter'); },
        },
        {
          ...alignrightButton,
          type: 'choiceitem',
          text: alignrightButton.tooltip,
          value: (api: any) => { editor.execCommand('JustifyRight'); },
        },
      ];
      callback(items);
    },
  });

  const italicButton = editor.ui.registry.getAll().buttons.italic;
  const strikethroughButton = editor.ui.registry.getAll().buttons.strikethrough;
  const superscriptButton = editor.ui.registry.getAll().buttons.superscript;
  const subscriptButton = editor.ui.registry.getAll().buttons.subscript;
  // Drop-down with italic, strikethrough, ...
  editor.ui.registry.addSplitButton('formatgroup', {
    ...italicButton,
    presets: 'listpreview',
    columns: 3,
    onItemAction: (api: any, value: any) => {
      value(api);
    },
    fetch: (callback: any) => {
      const items = [
        {
          ...strikethroughButton,
          type: 'choiceitem',
          text: strikethroughButton.tooltip,
          value: (api: any) => { editor.execCommand('Strikethrough'); },
        },
        {
          ...superscriptButton,
          type: 'choiceitem',
          text: superscriptButton.tooltip,
          value: (api: any) => { editor.execCommand('Superscript'); },
        },
        {
          ...subscriptButton,
          type: 'choiceitem',
          text: subscriptButton.tooltip,
          value: (api: any) => { editor.execCommand('Subscript'); },
        },
      ];
      callback(items);
    },
  });

  const bullistButton = editor.ui.registry.getAll().buttons.bullist;
  const outdentButton = editor.ui.registry.getAll().buttons.outdent;
  const indentButton = editor.ui.registry.getAll().buttons.indent;
  // Drop-down with numbered list, bullet list, ...
  editor.ui.registry.addSplitButton('listgroup', {
    ...bullistButton,
    presets: 'listpreview',
    columns: 3,
    onItemAction: (api: any, value: any) => {
      value(api);
    },
    fetch: (callback: any) => {
      const items = [
        {
          ...outdentButton,
          type: 'choiceitem',
          text: outdentButton.tooltip,
          value: (api: any) => { editor.execCommand('Outdent'); },
        },
        {
          ...indentButton,
          type: 'choiceitem',
          text: indentButton.tooltip,
          value: (api: any) => { editor.execCommand('Indent'); },
        },
      ];
      callback(items);
    },
  });

  // Switch normal / advanced mode
  editor.ui.registry.addButton('modestandard', {
    icon: 'close',
    tooltip: 'SwitchMode.Standard',
    onAction: (_: any) => {
      switchModes('standard', editor);
    },
  });

  editor.ui.registry.addButton('modeinline', {
    icon: 'close',
    tooltip: 'SwitchMode.Standard',
    onAction: (_: any) => {
      switchModes('inline', editor);
    },
  });

  editor.ui.registry.addButton('modeadvanced', {
    icon: 'custom-school',
    tooltip: 'SwitchMode.Pro',
    onAction: (_: any) => {
      switchModes('advanced', editor);
    },
  });

  editor.ui.registry.addButton('expandfulleditor', {
    icon: 'browse',
    tooltip: 'SwitchMode.Expand',
    onAction: (_: any) => {
      expand(true);
    },
  });

  // h1, h2, etc. buttons, inspired by http://blog.ionelmc.ro/2013/10/17/tinymce-formatting-toolbar-buttons/
  // note that the complex array is needed because auto-translate only happens if the string is identical
  [['pre', 'Preformatted', 'Preformatted'],
  /*
    custom p, H1-H6 only for the toolbar listpreview menu
    [name, buttonCommand, tooltip, text, icon]
  */
  ['cp', 'p', 'Paragraph', 'Paragraph', 'custom-image-p'],
  // ['code', 'Code', 'Code'],
  ['ch1', 'h1', 'Heading 1', 'H1', 'custom-image-h1'],
  ['ch2', 'h2', 'Heading 2', 'H2', 'custom-image-h2'],
  ['ch3', 'h3', 'Heading 3', 'H3', 'custom-image-h3'],
  ['ch4', 'h4', 'Heading 4', 'H4', 'custom-image-h4'],
  ['ch5', 'h5', 'Heading 5', 'H5', 'custom-image-h5'],
  ['ch6', 'h6', 'Heading 6', 'H6', 'custom-image-h6']].forEach((tag) => {
    editor.ui.registry.addButton(tag[0], {
      icon: tag[4],
      tooltip: tag[2],
      text: tag[2],
      onAction: (_: any) => {
        editor.execCommand('mceToggleFormat', false, tag[1]);
      },
      onSetup: initOnPostRender(tag[0], editor),
    });
  });

  // Group of buttons with an h3 to start and showing h4-6 + p
  const blockquoteButton = editor.ui.registry.getAll().buttons.blockquote;
  editor.ui.registry.addSplitButton('hgroup', {
    ...editor.ui.registry.getAll().buttons.h4,
    presets: 'listpreview',
    columns: 4,
    onItemAction: (api: any, value: any) => {
      value(api);
    },
    fetch: (callback: any) => {
      const items = [
        {
          ...editor.ui.registry.getAll().buttons.ch1,
          type: 'choiceitem',
          value: (api: any) => { editor.execCommand('mceToggleFormat', false, 'h1'); },
        },
        {
          ...editor.ui.registry.getAll().buttons.ch2,
          type: 'choiceitem',
          value: (api: any) => { editor.execCommand('mceToggleFormat', false, 'h2'); },
        },
        {
          ...editor.ui.registry.getAll().buttons.ch3,
          type: 'choiceitem',
          value: (api: any) => { editor.execCommand('mceToggleFormat', false, 'h3'); },
        },
        {
          ...editor.ui.registry.getAll().buttons.cp,
          type: 'choiceitem',
          value: (api: any) => { editor.execCommand('mceToggleFormat', false, 'p'); },
        },
        {
          ...editor.ui.registry.getAll().buttons.ch4,
          type: 'choiceitem',
          value: (api: any) => { editor.execCommand('mceToggleFormat', false, 'h4'); },
        },
        {
          ...editor.ui.registry.getAll().buttons.ch5,
          type: 'choiceitem',
          value: (api: any) => { editor.execCommand('mceToggleFormat', false, 'h5'); },
        },
        {
          ...editor.ui.registry.getAll().buttons.ch6,
          type: 'choiceitem',
          value: (api: any) => { editor.execCommand('mceToggleFormat', false, 'h6'); },
        },
        {
          ...blockquoteButton,
          type: 'choiceitem',
          text: blockquoteButton.tooltip,
          value: (api: any) => { editor.execCommand('mceToggleFormat', false, 'blockquote'); },
        },
      ];
      callback(items);
    },
  });

  // Inside content (contentblocks)
  editor.ui.registry.addButton('addcontentblock', {
    icon: 'custom-content-block',
    tooltip: 'ContentBlock.Add',
    onAction: (_: any) => {
      const guid = MathHelper.uuid().toLowerCase(); // requires the uuid-generator to be included
      editor.insertContent(`<hr sxc="sxc-content-block" guid="${guid}" />`); // spm guid generation might be broken
    },
  });

  // Image alignment / size buttons in context menu
  editor.ui.registry.addButton('alignimgleft', {
    icon: 'align-left',
    tooltip: 'Align left',
    onAction: (_: any) => {
      editor.execCommand('JustifyLeft');
    },
    onPostRender: initOnPostRender('alignleft', editor),
  });
  editor.ui.registry.addButton('alignimgcenter', {
    icon: 'align-center',
    tooltip: 'Align center',
    onAction: (_: any) => {
      editor.execCommand('JustifyCenter');
    },
    onPostRender: initOnPostRender('aligncenter', editor),
  });
  editor.ui.registry.addButton('alignimgright', {
    icon: 'align-right',
    tooltip: 'Align right',
    onAction: (_: any) => {
      editor.execCommand('JustifyRight');
    },
    onPostRender: initOnPostRender('alignright', editor),
  });

  const imgMenuArray: any = [];
  for (let imgs = 0; imgs < imgSizes.length; imgs++) {
    const config = {
      icon: 'resize',
      tooltip: `${imgSizes[imgs]}%`,
      text: `${imgSizes[imgs]}%`,
      value: (api: any) => { editor.formatter.apply(`imgwidth${imgSizes[imgs]}`); },
      onAction: (_: any) => {
        editor.formatter.apply(`imgwidth${imgSizes[imgs]}`);
      },
      onPostRender: initOnPostRender(`imgwidth${imgSizes[imgs]}`, editor),
    };
    editor.ui.registry.addButton(`imgresize${imgSizes[imgs]}`, config);
    imgMenuArray.push(config);
  }
  editor.ui.registry.addButton('resizeimg100', {
    icon: 'resize',
    tooltip: '100%',
    onAction: (_: any) => {
      editor.formatter.apply('imgwidth100');
    },
    onPostRender: initOnPostRender('imgwidth100', editor),
  });

  // group of buttons to resize an image 100%, 50%, etc.
  editor.ui.registry.addSplitButton('imgresponsive', {
    ...editor.ui.registry.getAll().buttons.resizeimg100,
    onItemAction: (api: any, value: any) => {
      value(api);
    },
    fetch: (callback: any) => {
      const items: any = [];
      imgMenuArray.forEach((imgSizeOption: any) => {
        items.push({
          ...imgSizeOption,
          type: 'choiceitem',
        });
      });
      callback(items);
    },
  });

  // Context toolbars
  editor.ui.registry.addContextToolbar('a', {
    predicate: makeTagDetector('a', editor),
    items: 'link unlink',
  });
  editor.ui.registry.addContextToolbar('img', {
    predicate: makeTagDetector('img', editor),
    items: 'image | alignimgleft alignimgcenter alignimgright imgresponsive | removeformat | remove',
  });
  editor.ui.registry.addContextToolbar('li,ol,ul', {
    predicate: makeTagDetector('li,ol,ul', editor),
    items: 'numlist bullist | outdent indent',
  });
}

/**
 * Helper function to add activate/deactivate to buttons like alignleft, alignright etc.
 * copied/modified from
 * https://github.com/tinymce/tinymce/blob/ddfa0366fc700334f67b2c57f8c6e290abf0b222/js/tinymce/classes/ui/FormatControls.js#L232-L249
 */
function initOnPostRender(name: any, editor: any) {
  return function (buttonApi: any) {
    function watchChange() {
      editor.formatter.formatChanged(name, function (state: any) {
        try {
          buttonApi.setActive(state);
        } catch (error) {
          // cannot be set active when not visible on toolbar and is behing More... button
          // console.error('button set active error:', error);
        }
      });
    }

    if (editor.formatter) {
      watchChange();
    } else {
      editor.on('init', watchChange);
    }
  };
}

/** Register all formats - like img-sizes */
function registerTinyMceFormats(editor: any, imgSizes: number[]) {
  const imgformats: any = {};
  for (let imgs = 0; imgs < imgSizes.length; imgs++) {
    imgformats[`imgwidth${imgSizes[imgs]}`] = [{ selector: 'img', collapsed: false, styles: { 'width': `${imgSizes[imgs]}%` } }];
  }
  editor.formatter.register(imgformats);
}

// Mode switching and the buttons for it
function switchModes(mode: any, editor: any) {
  editor.settings.toolbar = editor.settings.modes[mode].toolbar;
  editor.settings.menubar = editor.settings.modes[mode].menubar;

  // refresh editor toolbar
  editor.editorManager.remove(editor);
  editor.editorManager.init(editor.settings);
}

// My context toolbars for links, images and lists (ul/li)
function makeTagDetector(tagWeNeedInTheTagPath: any, editor: any) {
  return function tagDetector(currentElement: any) {
    // check if we are in a tag within a specific tag
    const selectorMatched = editor.dom.is(currentElement, tagWeNeedInTheTagPath) && editor.getBody().contains(currentElement);
    return selectorMatched;
  };
}
