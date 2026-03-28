import { useEffect, useState } from 'react';
import { Grid, Stack, ThemeProvider } from '@mui/material';
import { AAGuidInfo } from './types/AAGuidInfo';
import { ColumnInfo, FIDOMDSCOLUMNS, PASSKEYCOLUMNS } from './types/ColumnInfo';
import HeaderBar from './components/HeaderBar';
import InfoCard from './components/InfoCard';
import AAGuidTable from './components/AAGuidTable';
import { darkTheme } from './components/Theme';

const passkeyInfo = process.env.REACT_APP_PASSKEY_INFO_URL || '';
const sampleQueryUnofficialUri = process.env.REACT_APP_SAMPLE_QUERY_UNOFFICIAL_URI || '';
const sampleQueryOfficialUri = process.env.REACT_APP_SAMPLE_QUERY_OFFICIAL_URI || '';

function App() {
  const [data, setData] = useState<AAGuidInfo[]>([]);
  const [showOfficial, setShowOfficial] = useState(false);
  const [columns, setColumns] = useState<ColumnInfo[]>(PASSKEYCOLUMNS);

  // Toggle between showing only FIDO Certified Passkeys and all Passkeys
  const toggleShowOfficial = (showOfficial: boolean) => {
    setShowOfficial(showOfficial);
    if (showOfficial) {
      setColumns(FIDOMDSCOLUMNS);
    } else {
      setColumns(PASSKEYCOLUMNS);
    }
  }

  // Fetch data from the appropriate source based on the showOfficial state
  useEffect(() => {
    if (showOfficial) {
      fetch('/mdsblob.json')
        .then(response => response.json())
        .then(data => data
          .filter((entry: AAGuidInfo) => entry.protocolFamily === 'fido2')
          .map((entry: AAGuidInfo) => ({ ...entry, id: entry.aaguid }))
        )
        .then((filteredData: AAGuidInfo[]) => setData(filteredData))
        .catch(console.error);

    } else {
      fetch('/combined_aaguid.json')
        .then(response => response.json())
        .then(data => data
          .map((entry: any, id: number) => ({ aaguid: entry.AAGuid, description: entry.Name, id: id }))
        )
        .then((filteredData: AAGuidInfo[]) => setData(filteredData))
        .catch(console.error);
    }
  }, [showOfficial])

  return (
    <div>
      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <ThemeProvider theme={darkTheme}>
          <HeaderBar
            showOfficial={showOfficial}
            toggleShowOfficial={toggleShowOfficial}
            sampleQueryOfficialUri={sampleQueryOfficialUri}
            sampleQueryUnofficialUri={sampleQueryUnofficialUri}
            passkeyInfo={passkeyInfo}
          />
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
        <InfoCard showOfficial={showOfficial} />
        <AAGuidTable data={data} columns={columns} />
      </Grid>
    </div>
  );
}

export default App;
