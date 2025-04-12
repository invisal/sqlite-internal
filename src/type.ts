export interface Database {
  header: DatabaseHeader;
  pages: DatabaseParsedPage[];
}

export interface DatabaseHeader {
  pageSize: number;
  fileFormatWriteVersion: number;
  fileFormatReadVersion: number;
  reservedSpace: number;
  maxPageSize: number;
  writeVersion: number;
  readVersion: number;
  pageCount: number;
  firstFreelistPage: number;
  totalFreelistPages: number;
  schemaCookie: number;
  schemaFormatNumber: number;
  schemaChangeCounter: number;
  fileChangeCounter: number;
}

export type DatabasePageType =
  | "Table Interior"
  | "Table Leaf"
  | "Index Interior"
  | "Index Leaf"
  | "Free Trunk"
  | "Free Leaf"
  | "Overflow"
  | "Unknown";

export interface DatabaseUnparsedPage {
  number: number;
  data: Uint8Array;
  type: DatabasePageType;
}

export interface DatabaseBTreePage extends DatabaseUnparsedPage {
  header: SqlitePageHeader;
  cellPointerArray: SqliteCellPointer[];
}

export interface TableInteriorPage extends DatabaseBTreePage {
  type: "Table Interior";
  cells: SqliteTableInteriorCell[];
}

export interface TableLeafPage extends DatabaseBTreePage {
  type: "Table Leaf";
  cells: SqliteTableLeafCell[];
}

export interface IndexInteriorCell {
  leftChildPagePointer: number;
  payloadSize: number;
  payload: ArrayBuffer;
  overflowPageNumber: number | null;
  length: number;
  offset: number;
}

export interface IndexInteriorPage extends DatabaseBTreePage {
  type: "Index Interior";
  cells: IndexInteriorCell[];
}

export interface IndexLeafCell {
  payloadSize: number;
  payload: ArrayBuffer;
  overflowPageNumber: number | null;
  length: number;
  offset: number;
}

export interface IndexLeafPage extends DatabaseBTreePage {
  type: "Index Leaf";
  cells: IndexLeafCell[];
}

export interface FreeTrunkCell {
  offset: number;
  length: number;
  pageNumber: number;
}

export interface FreeTrunkPage extends DatabaseUnparsedPage {
  type: "Free Trunk";
  nextTrunkPage: number;
  count: number;
  freePageNumbers: FreeTrunkCell[];
}
export interface FreeLeafPage extends DatabaseUnparsedPage {
  type: "Free Leaf";
}

export interface OverflowPage extends DatabaseUnparsedPage {
  type: "Overflow";
  nextPage: number;
}

export interface UnknownPage extends DatabaseUnparsedPage {
  type: "Unknown";
}

export type DatabaseParsedPage =
  | TableInteriorPage
  | TableLeafPage
  | IndexInteriorPage
  | IndexLeafPage
  | FreeTrunkPage
  | FreeLeafPage
  | OverflowPage
  | UnknownPage;

export interface SqlitePageHeader {
  pageType: number;
  firstFreeblockOffset: number;
  cellCount: number;
  cellPointerArrayOffset: number;
  fragmentFreeBytes: number;
  rightChildPageNumber: number | null;
}

export interface SqliteCellPointer {
  offset: number;
  length: number;
  content: ArrayBuffer;
  value: number;
}

export interface SqliteTableInteriorCell {
  pageNumber: number;
  rowid: number;
  content: ArrayBuffer;
  length: number;
  offset: number;
}

export interface SqliteTableLeafCell {
  size: number;
  rowid: number;
  payload: ArrayBuffer;
  overflowPageNumber: number;
  content: ArrayBuffer;
  length: number;
  offset: number;
}

export type InfoType =
  | {
      type: "started";
    }
  | {
      type: "database" | "database-header";
      database: Database;
    }
  | {
      type: "page";
      database: Database;
      page: DatabaseParsedPage;
    }
  | {
      type: "btree-page-header";
      page: DatabaseParsedPage;
    }
  | {
      type: "btree-cell-pointer";
      page: DatabaseParsedPage;
      cellPointer: SqliteCellPointer;
    }
  | {
      type: "table-leaf-cell";
      page: TableLeafPage;
      cell: SqliteTableLeafCell;
    }
  | {
      type: "table-interior-cell";
      page: TableInteriorPage;
      cell: SqliteTableInteriorCell;
    }
  | {
      type: "index-leaf-cell";
      page: IndexLeafPage;
      cell: IndexLeafCell;
    }
  | {
      type: "index-interior-cell";
      page: IndexInteriorPage;
      cell: IndexInteriorCell;
    }
  | {
      type: "free-trunk-page";
      page: FreeTrunkPage;
    }
  | {
      type: "free-leaf-page";
      page: FreeLeafPage;
    }
  | {
      type: "overflow-page";
      page: OverflowPage;
    }
  | {
      type: "unknown-page";
      page: UnknownPage;
    };
