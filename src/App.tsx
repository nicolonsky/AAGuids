import { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Avatar, Grid, Link, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material';
import { UUID } from 'crypto';
import NextPlanIcon from '@mui/icons-material/NextPlan';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';


function App() {

  type AAGuidInfo = {
    description: string,
    aaguid: UUID
    authenticatorVersion: number
    protocolFamily: string,
    authenticationAlgorithms: string[],
    keyProtection: string[],
    attachmentHint: string[]
  }

  const [data, setData] = useState<AAGuidInfo[]>([]);

  useEffect(() => {
    fetch('/mdsblob.json')
      .then(response => response.json())
      .then(data => data
        .filter((entry: AAGuidInfo) => entry.protocolFamily === 'fido2')
        .map((entry: AAGuidInfo) => ({ ...entry, id: entry.aaguid }))

      )
      .then((filteredData: AAGuidInfo[]) => setData(filteredData))
      .catch(console.error);
  }, [])

  const columns = [
    { field: 'description', headerName: 'Name', flex: 1 },
    { field: 'aaguid', headerName: 'AAGUID', flex: 1 },
    { field: 'authenticationAlgorithms', headerName: 'Authn Algorithms', flex: 1 },
    { field: 'keyProtection', headerName: 'Key Protection', flex: 1 },
    { field: 'attachmentHint', headerName: 'Attachment Hint', flex: 1 },
  ];

  return (
    <Grid
      container
      spacing={1}
      direction="column"
      alignItems="center"
      justifyContent="center"
      width='100%'
    >
      <Typography variant="h1" component="h2">
        AAGUIDs
      </Typography>
      <Typography>
        AAGUIDs are the unique identifiers for passkey authenticators. They are used to identify the authenticator when using the WebAuthn API.
      </Typography>
      <Typography>
        This list is based on the <Link href="https://fidoalliance.org/metadata/">FIDO Alliance Metadata Service</Link>.
      </Typography>

      <List component={Stack} direction="row">
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <CalendarMonthIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText sx={{
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }} primary={process.env.REACT_APP_TIME_GENERATED} secondary="Last Update" />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <NextPlanIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText sx={{
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
            primary={process.env.REACT_APP_NEXT_UPDATE} secondary="Next Update" />
        </ListItem>
      </List>
      <Grid item xl style={{ width: '95%' }}>
        <DataGrid
          autoHeight={true}
          rows={data}
          columns={columns}
          initialState={{
            sorting: {
              sortModel: [{ field: 'description', sort: 'asc' }],
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
