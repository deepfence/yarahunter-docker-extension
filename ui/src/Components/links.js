import * as React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import {GitHub} from '@mui/icons-material/';

export default function Links() {
    return (
        <Stack direction="row" spacing={1} mt={1}>
            <Chip icon={<GitHub />}
                label="deepfence/YaraHunter"
                variant="outlined"
                component="a"
                target="_blank"
                href="https://github.com/deepfence/YaraHunter"
                clickable
            />
            <Chip icon={<GitHub />}
                label="deepfence/ThreatMapper"
                variant="outlined"
                component="a"
                target="_blank"
                href="https://github.com/deepfence/ThreatMapper"
                clickable
            />
        </Stack>
    );
}
