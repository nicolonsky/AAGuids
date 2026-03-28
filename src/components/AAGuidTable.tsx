import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Grid } from '@mui/material';
import { ColumnInfo } from '../types/ColumnInfo';
import {AAGuidInfo} from '../types/AAGuidInfo';

interface AAGuidTableProps {
  data: AAGuidInfo[];
  columns: ColumnInfo[];
}

const AAGuidTable: React.FC<AAGuidTableProps> = ({ data, columns }) => (
  <Grid item xl xs={10} sx={{ width: '90%' }}>
    <DataGrid
      autoHeight={true}
      rows={data}
      columns={columns}
      density='compact'
      initialState={{
        sorting: {
          sortModel: [{ field: 'description', sort: 'asc' }],
        }
      }}
      slots={{ toolbar: GridToolbar }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
        },
      }}
    />
  </Grid>
);

export default AAGuidTable;
