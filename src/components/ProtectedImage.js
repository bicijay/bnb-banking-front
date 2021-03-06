import React, {useCallback, useEffect, useState} from 'react';
import api from "../services/api";
import ImageViewer from 'react-simple-image-viewer';

const ProtectedImage = (props) => {
    const [imageUrl, setImageUrl] = useState(false);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    const setImage = async () => {
        const response = await api.get(`admin/images/${props.imageId}`, {
            responseType: "arraybuffer"
        });

        const data = `data:${
            response.headers["content-type"]
        };base64,${new Buffer(response.data, "binary").toString("base64")}`;

        setImageUrl(data);
    }

    const openImageViewer = useCallback((index) => {
        setIsViewerOpen(true);
    }, []);

    const closeImageViewer = () => {
        setIsViewerOpen(false);
    };

    useEffect(() => {
        if (props.imageId) {
            setImage();
        }
    }, [props.imageId])

    if (!props.imageId) {
        return null;
    }

    return (<>
            {isViewerOpen && (
                <ImageViewer
                    backgroundStyle={{zIndex: 2000}}
                    src={[imageUrl]}
                    currentIndex={0}
                    disableScroll={false}
                    onClose={closeImageViewer}
                />
            )}
            <img onClick={openImageViewer} {...props} src={imageUrl}/>
        </>
    )
};

export default ProtectedImage;