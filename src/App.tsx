import { Component, useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { AppBar, Avatar, Box, Button, CardActions, createTheme, FormControlLabel, Grid, Icon, IconButton, Link, List, ListItem, ListItemAvatar, ListItemText, Stack, Switch, ThemeProvider, Toolbar, Typography } from '@mui/material';
import { UUID } from 'crypto';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NextPlanIcon from '@mui/icons-material/NextPlan';
import GitHubIcon from '@mui/icons-material/GitHub';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import React from 'react';
import InfoOutlineIcon from '@mui/icons-material/InfoOutlined';

const unofficialUri = 'https://raw.githubusercontent.com/nicolonsky/AAGuids/main/public/combined_aaguid.json';
const passkeyInfo = 'https://fidoalliance.org/passkeys/';
const sampleQueryUri = 'https://security.microsoft.com/v2/advanced-hunting?query=H4sIABfYxmkAA12PywqCQBSG_3VP4c6EsL3QolW7XiAiRpvUSI1ppIIevm8Gg5DDXM5_ORerl7ysnHoZ3XTm9pxES22JnUa1oAXIA8aR9aq1It-j6_DOuYz8oFQNmNcdrtCaMEQ91ctRtqo00NOgGKcpcrAGbWA6lbGiRX-aua94BrhUR7o9QT2-MPUF3OENe2x4Rzp4-J8j00KfOHHQeX6l3n_bJHGeSl8h-gH_GgEAAA&timeRangeId=day';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

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
    <div>
     <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <ThemeProvider theme={darkTheme}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              AAGUIDs
            </Typography>
            <Button color="inherit" LinkComponent={Link} href="https://github.com/nicolonsky/AAGUIDs" target='_blank'><GitHubIcon /></Button>
            <Button color="inherit" LinkComponent={Link} href={sampleQueryUri} target='_blank'>
              <img src="/xdr.ico" alt="Defender XDR" style={{ width: 22, height: 22, verticalAlign: 'middle' }} />
            </Button>
          </Toolbar>
        </AppBar>
        </ThemeProvider>
      </Stack>

      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        justifyContent="center"
        width='100%'
        sx={{ mt: 5 }}
      >
        <Box sx={{ minWidth: 275, maxWidth: '50%', marginTop: 4 }}>
          <Card variant="elevation">
            <CardContent>
              <Typography variant="h5" component="div">
                pæs{bull}ki
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>noun</Typography>
              <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                A <strong>passkey</strong> is a FIDO authentication credential based on FIDO standards, that allows a user to sign in to apps and websites with the same process that they use to unlock their device (biometrics, PIN, or pattern).
              </Typography>
              <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                <strong>AAGUIDs</strong> are unique identifiers assigned to FIDO authenticators (including passkeys and security keys) and are used to identify authenticator models for attestation and metadata purposes.
              </Typography> 
            </CardContent>
            <CardActions>
              <FormControlLabel
                control={<Switch />}
                label="Display unofficial passkey blob"
                onChange={(_event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
                  toggleShowUnofficial(checked);
                }}
              />
              <Button size="small"><Link href={passkeyInfo}>Learn More about Passkeys</Link></Button>
            </CardActions>

            <List component={Stack} direction="row">
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <InfoOutlineIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText sx={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
                  primary='Source of this list' secondary={
                    showUnofficial ? <Link href="https://github.com/passkeydeveloper/passkey-authenticator-aaguids">Passkeys Developer Resources
</Link> : <Link href="https://fidoalliance.org/metadata/">FIDO Alliance Metadata Service</Link>
                  } />
              </ListItem>
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
          </Card>
        </Box>

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
    </div>
  );
}

export default App;
