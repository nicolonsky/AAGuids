import React from 'react';
import { Box, Card, CardContent, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Stack, Link } from '@mui/material';
import InfoOutlineIcon from '@mui/icons-material/InfoOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NextPlanIcon from '@mui/icons-material/NextPlan';

const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);

interface InfoCardProps {
  showOfficial: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({ showOfficial }) => (
  <Box sx={{ width: '50%', marginTop: 4, mb: 5 }}>
    <Card variant="elevation" elevation={4}>
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
      <List component={Stack} direction="row">
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <InfoOutlineIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
            secondary='List source'
            primary={
              showOfficial ? (
                <Link href="https://fidoalliance.org/metadata/">FIDO Alliance Metadata Service</Link>
              ) : (
                <Link href="https://github.com/passkeydeveloper/passkey-authenticator-aaguids">Passkeys Developer Resources</Link>
              )
            }
          />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <CalendarMonthIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
            primary={process.env.REACT_APP_TIME_GENERATED}
            secondary="Last Update"
          />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <NextPlanIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
            primary={process.env.REACT_APP_NEXT_UPDATE}
            secondary="Next Update"
          />
        </ListItem>
      </List>
    </Card>
  </Box>
);

export default InfoCard;
