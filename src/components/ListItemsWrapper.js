import React from 'react';
import {Divider, ListItem, ListItemText, Typography} from "@material-ui/core";
import {Skeleton} from "@material-ui/lab";

const ListItemsWrapper = ({loading, placeholderItems, hasItems, children}) => {
    if (loading) {
        return Array.from(Array(placeholderItems).keys()).map(() => (
            <>
                <ListItem>
                    <ListItemText primary={<Skeleton/>} secondary={<Skeleton/>}/>
                </ListItem>
                <Divider/>
            </>
        ))
    }

    if (!hasItems) {
        return <Typography align={"center"} variant={"subtitle1"} style={{margin: 20, opacity: 0.6}}>No items were found.</Typography>
    }

    return children;
};

export default ListItemsWrapper;