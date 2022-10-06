import { useEffect, useState } from 'react';
import { Autocomplete, Button, TextField, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab"
import KeyIcon from '@mui/icons-material/Key';
import { createDockerDesktopClient } from '@docker/extension-api-client';
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
    return client;
}

function ImageSearch(props) {
  const ddClient = useDockerDesktopClient();

  let [images,setImages] = useState([])
  let [image,setImage] = useState("")
  let [loading,setLoading] = useState(false);

  function handleScan() {
    if(props.onChange) props.onChange(image, setLoading);
  }

  async function getImages() {
    setLoading(true);
    let images = await ddClient.docker.listImages();
    images = images.filter(i=>i.RepoTags).filter(image => image.RepoTags[0])
    .filter(image => image.RepoTags[0]!=="<none>:<none>")
    .map(image => image.RepoTags[0])
    setImages(images);
    setLoading(false);
  }

  function handleImageInputChange(e,newValue) {
    setImage(newValue);
  } 
  function handleImageChange(e,newValue) {
    setImage(newValue);
    if(newValue) {
      //if(props.onChange) props.onChange(newValue);
    }
  } 

  return (
    <div className={"image_search "+(props.mode==="scan"?"image_scan ":" ")}>
      <Box sx={{ width: "100%", display: 'flex', marginTop: '8px', marginBottom: '8px' }}>
        <Box sx={{ flexGrow: 1, marginRight: '8px'}}>
          <Autocomplete
            freeSolo
            id="combo-box-demo"
            options={images}
            fullWidth={true}
            loading={loading}
            onOpen={getImages}
            noOptionsText="No local images found"
            onInputChange={handleImageInputChange}
            onChange={handleImageChange}
            className="image-select"
            // onInputChange={e=>setImage(e.target.value)}
            renderInput={(params) => <TextField className="image-select-input" variant="outlined" {...params} placeholder="Docker Image" />}
          />
        </Box>
        <Box>
          <LoadingButton
          style={{height:'100%', width: '18em'}}
          disabled={!image}
          color="primary"
          onClick={handleScan}
          loading={loading}
          loadingPosition="start"
          startIcon={<KeyIcon />}
          variant="contained"
        >
          {(!images.includes(image)&&image?.length>0)?"Download and ":""}Scan Image
        </LoadingButton>
        </Box>
      </Box>
    </div>
  )
}

export default ImageSearch;