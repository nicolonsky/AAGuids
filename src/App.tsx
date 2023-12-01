import { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Avatar, FormControlLabel, Grid, Link, List, ListItem, ListItemAvatar, ListItemText, Stack, Switch, Typography } from '@mui/material';
import { UUID } from 'crypto';
import NextPlanIcon from '@mui/icons-material/NextPlan';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const unofficialUri = 'https://raw.githubusercontent.com/nicolonsky/ITDR/main/Watchlists/aaguids.json';

const fidoMdsColumns: ColumnInfo[] = [
  { field: 'description', headerName: 'Name', flex: 1 },
  { field: 'aaguid', headerName: 'AAGUID', flex: 1 },
  { field: 'authenticationAlgorithms', headerName: 'Authn Algorithms', flex: 1 },
  { field: 'keyProtection', headerName: 'Key Protection', flex: 1 },
  { field: 'attachmentHint', headerName: 'Attachment Hint', flex: 1 },
];

const passkeyColumns: ColumnInfo[] = [
  { field: 'description', headerName: 'Name', flex: 1 },
  { field: 'aaguid', headerName: 'AAGUID', flex: 1 }
];

type AAGuidInfo = {
  description: string,
  aaguid: UUID
  authenticatorVersion: number
  protocolFamily: string,
  authenticationAlgorithms: string[],
  keyProtection: string[],
  attachmentHint: string[]
}

type ColumnInfo = {
  field: string;
  headerName: string;
  flex: number;
}


function App() {

  const [data, setData] = useState<AAGuidInfo[]>([]);
  const [showUnofficial, setShowUnofficial] = useState(false);
  const [columns, setColumns] = useState<ColumnInfo[]>(fidoMdsColumns);

  const toggleShowUnofficial = (showUnofficial: boolean) => {
    setShowUnofficial(showUnofficial);
    if (showUnofficial) {
      setColumns(passkeyColumns);
    } else {
      setColumns(fidoMdsColumns);
    }
  }

  useEffect(() => {
    if (showUnofficial) {
      fetch(unofficialUri)
        .then(response => response.json())
        .then(data => data
          .map((entry: any, id: number) => ({ aaguid: entry.AAGuid, description: entry.Name, id: id }))
        )
        .then((filteredData: AAGuidInfo[]) => setData(filteredData))
        .catch(console.error);

    } else {
      fetch('/mdsblob.json')
        .then(response => response.json())
        .then(data => data
          .filter((entry: AAGuidInfo) => entry.protocolFamily === 'fido2')
          .map((entry: AAGuidInfo) => ({ ...entry, id: entry.aaguid }))
        )
        .then((filteredData: AAGuidInfo[]) => setData(filteredData))
        .catch(console.error);
    }

  }, [showUnofficial])

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
        AAGUIDs are unique identifiers for FIDO2 authenticators such as passkeys and physical keys and are used for attestation purposes.
      </Typography>

      {showUnofficial ?
        <Typography>
          This list is based on the <Link href="https://github.com/passkeydeveloper/passkey-authenticator-aaguids">passkey-authenticator-aaguids repository</Link>.
        </Typography> :
        <Typography>
          This list is based on the <Link href="https://fidoalliance.org/metadata/">FIDO Alliance Metadata Service</Link>.
        </Typography>
      }

      <FormControlLabel
        control={<Switch />}
        label="Display unofficial passkey blob"
        onChange={(_event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
          toggleShowUnofficial(checked);
        }}
      />

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
