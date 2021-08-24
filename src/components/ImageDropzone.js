import React, {useCallback, useMemo} from 'react';
import {useDropzone} from "react-dropzone";
import {Typography} from "@material-ui/core";
import BackupIcon from '@material-ui/icons/Backup';

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

const ImageDropzone = ({onDrop, selectedPhoto}) => {

    const onFileDrop = useCallback(acceptedFiles => {
        onDrop(acceptedFiles);
    }, [])

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({accept: 'image/*', onDrop: onFileDrop});

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    return (
        <div className="container">
            <div {...getRootProps({style})}>
                <input {...getInputProps()} />
                {selectedPhoto ?
                    <img style={{width: '100%', maxWidth: 500, height: 'auto'}} src={URL.createObjectURL(selectedPhoto)}/> :
                    <>
                        <BackupIcon fontSize={"large"}/>
                        <Typography style={{marginTop: 5}} variant={"subtitle2"}>UPLOAD CHECK PICTURE</Typography>
                    </>}
            </div>
        </div>
    );
};

export default ImageDropzone;