export type ColumnInfo = {
  field: string;
  headerName: string;
  flex: number;
}

// Column definitions for the DataGrid, one for the official FIDO MDS data and one for the combined unofficial data. 
export const FIDOMDSCOLUMNS: ColumnInfo[] = [
  { field: 'description', headerName: 'Name', flex: 1 },
  { field: 'aaguid', headerName: 'AAGUID', flex: 1 },
  { field: 'authenticationAlgorithms', headerName: 'Authn Algorithms', flex: 1 },
  { field: 'keyProtection', headerName: 'Key Protection', flex: 1 },
  { field: 'attachmentHint', headerName: 'Attachment Hint', flex: 1 },
];

export const PASSKEYCOLUMNS: ColumnInfo[] = [
  { field: 'description', headerName: 'Name', flex: 1 },
  { field: 'aaguid', headerName: 'AAGUID', flex: 1 }
];
