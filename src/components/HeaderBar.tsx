import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Tooltip, Button, Link, FormControlLabel, Switch } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import InfoOutlineIcon from '@mui/icons-material/InfoOutlined';

interface HeaderBarProps {
    showOfficial: boolean;
    toggleShowOfficial: (checked: boolean) => void;
    sampleQueryOfficialUri: string;
    sampleQueryUnofficialUri: string;
    passkeyInfo: string;
    githubRepo: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
    showOfficial,
    toggleShowOfficial,
    sampleQueryOfficialUri,
    sampleQueryUnofficialUri,
    passkeyInfo,
    githubRepo
}) => (
    <AppBar position="fixed">
        <Toolbar>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                AAGUIDs
            </Typography>
            <Tooltip title="Display only FIDO Alliance Certified Passkeys">
                <FormControlLabel
                    control={<Switch checked={showOfficial} />}
                    label="FIDO Certified Passkeys"
                    onChange={(_event, checked) => toggleShowOfficial(checked)}
                />
            </Tooltip>
            <Tooltip title="GitHub Repository">
                <Button color="inherit" LinkComponent={Link} href={githubRepo} target='_blank'><GitHubIcon /></Button>
            </Tooltip>
            <Tooltip title="Use in Advanced Hunting">
                <Button color="inherit" LinkComponent={Link} href={showOfficial ? sampleQueryOfficialUri : sampleQueryUnofficialUri} target='_blank'>
                    <img src="/xdr.ico" alt="Defender XDR" style={{ width: 22, height: 22, verticalAlign: 'middle' }} />
                </Button>
            </Tooltip>
            <Tooltip title="Learn about Passkeys">
                <Button color="inherit" LinkComponent={Link} href={passkeyInfo}><InfoOutlineIcon /></Button>
            </Tooltip>
        </Toolbar>
    </AppBar>
);

export default HeaderBar;
