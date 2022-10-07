import React from 'react';
import {Divider, Typography} from '@mui/material';
import ImageSearch from "./Components/ImageSearch";

import {createDockerDesktopClient} from '@docker/extension-api-client';
import MalwareTable from './Components/malware-table';
import {Box} from '@mui/system';
import FullScreenDialog from './Components/details-dialog';
import Links from './Components/links';

// import {} from './assets/images/';

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
    return client;
}

interface response {
    Message: string;
}

interface message {
    "Time stamp": string
    "Image Name": string
    "Image ID": string
    "Container ID": string
    "IOC": IOC[]
}

interface IOC {
    "Image Layer ID": string
    "Matched Rule Name": string
    "Matched Part": string // array
    "Category"
    "Signature to Match": string
    Severity: string
    "Severity Score": number
    FileSeverity: number
    "File Severity Score": number
    "Full File Name": string
    "rule metadata": Map<string, string>
    Summary: number
}

export function App() {
    const [response, setResponse] = React.useState<IOC[]>();
    const ddClient = useDockerDesktopClient();
    const [open, setOpen] = React.useState(false);
    const [row, setRow] = React.useState({})

    const handleClickOpen = (row) => {
        setOpen(true);
        setRow(row)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const fetchAndDisplayResponse = async (image, setLoading) => {
        setLoading(true)
        setResponse(null)
        await ddClient.extension.vm?.service?.post('/malware/scan', {
            "image_name": image,
        })
            .then((result: any) => {
                let r: response = JSON.parse(JSON.stringify(result))
                let q: message = JSON.parse(r.Message)
                setResponse(q.IOC);
                ddClient.desktopUI.toast.success('Secret scanning finished!');
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
                ddClient.desktopUI.toast.error('Error scanning image, check console for errors');
                console.error('error', err)
            })
    };

    return (
        <>
            <Box sx={{marginTop: '2rem'}}>
                <Box sx={{m: '2rem', marginBottom: '1rem'}}>
                    <Box sx={{display: 'flex'}}>
                        <img style={{marginTop: '0.5rem'}} src="images/deepfence.svg" alt="Deepfence Logo"
                             height="60px"/>
                        <Box sx={{marginLeft: '1.5rem', marginTop: '0rem'}}>
                            <Typography variant="h3">Deepfence YaraHunter</Typography>
                            <Typography variant="body1" color="text.secondary" sx={{mt: 2}}>
                                Deepfence YaraHunter scans container images, running Docker containers, and filesystems to find indicators of malware.
                            </Typography>

                            <Typography variant="body1" color="text.secondary" sx={{mt: 0}}>
                                Select the image from the dropdown and scan for secrets.
                            </Typography>
                            <Links/>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <ImageSearch onChange={fetchAndDisplayResponse}/>
            <Divider style={{marginTop: 10, marginBottom: 10}}/>
            {response && <MalwareTable
                rows={response}
                handleClickOpen={handleClickOpen}
            />}
            <FullScreenDialog
                open={open}
                handleClose={handleClose}
                row={row}
            />
        </>
    );
}
