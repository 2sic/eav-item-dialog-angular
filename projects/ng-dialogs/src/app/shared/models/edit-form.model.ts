import { EavFor } from '../../../../../edit/shared/models/eav';

/** Type for edit form. To add new item send newItem and to edit existing item send editItems */
export class EditForm {
  constructor(public items: (AddItem | EditItem | GroupItem | SourceItem)[]) { }
}

export class EditItem {
  constructor(public EntityId: number) { }
}

export class AddItem {
  /** Content type */
  ContentTypeName: string;
  /** Add item as metadata to another item */
  For?: EavFor;
  /** Deprecated 2sxc 9 Metadata object */
  Metadata?: LegacyMetadata;
  /** Prefill form with data */
  Prefill?: { [key: string]: string };
  /** Prefill form with data from another entity */
  DuplicateEntity?: number;
}

export class GroupItem {
  Group: GroupItemGroup;
}

export class GroupItemGroup {
  Guid: string;
  Index: number;
  Part: string;
  Add: boolean;
}

export class SourceItem {
  constructor(public Path: string) { }
}

/** Deprecated 2sxc 9 Metadata object */
export class LegacyMetadata {
  key: string;
  keyType: string;
  targetType: number;
}
