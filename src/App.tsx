import { useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Grid, Link, Typography } from '@mui/material';

function App() {

  const [data, setData] = useState<object[]>([]);
  fetch('combined_aaguid.json')
    .then(response => response.json())
    .then(data => Object.entries(data).map(([key, value]) => ({ id: key, name: (value as { name: string }).name })))
    .then(setData)
    .catch(console.error);


  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'id', headerName: 'AAGUID', flex: 1 }
  ];

  return (
    <Grid
      container
      spacing={1}
      direction="column"
      alignItems="center"
      justifyContent="center"
      //sx={{ minHeight: '100vh', minWidth: '75vw' }}
    >
      <Typography variant="h1" component="h2">
        AAGUIDs
      </Typography>
      <Typography>
        AAGUIDs are the unique identifiers for passkey authenticators. They are used to identify the authenticator when using the WebAuthn API.
      </Typography>
      <Typography>
        This list is based on the <Link href="https://github.com/passkeydeveloper/passkey-authenticator-aaguids/blob/main/combined_aaguid.json">FIDO Alliance Metadata Service</Link> and is updated regularly.
      </Typography>

      <Grid item>
        <DataGrid
          rows={data}
          columns={columns}
          initialState={{
            sorting: {
              sortModel: [{ field: 'name', sort: 'asc' }],
            },
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </Grid>
    </Grid>
  );
}

export default App;
