import React, {useEffect, useState} from 'react';
import PageWrapper from "../../components/PageWrapper";
import {Divider, List, ListItem, ListItemSecondaryAction, ListItemText, Typography, useTheme} from "@material-ui/core";
import ListItemsWrapper from "../../components/ListItemsWrapper";
import api from "../../services/api";
import {format} from "date-fns";
import {formatMoney} from "../../utils/helpers";
import {useHistory, useParams} from "react-router-dom";

const PendingCheckPageLink = (props) => {
    let history = useHistory();
    return <ListItem button onClick={() => history.push(props.to)} {...props}/>
};

const CheckControlPage = () => {
    let theme = useTheme();
    const [pendingChecks, setPendingChecks] = useState([]);
    const [loading, setLoading] = useState(false);

    const renderPendingChecks = () => {
        return pendingChecks.map((check) => (
            <>
                <PendingCheckPageLink to={`admin/deposit/${check.id}/review`}>
                    <ListItemText primary={check.description} secondary={format(new Date(check.created_at),"MM/dd/y hh:mm a")}/>
                    <ListItemSecondaryAction>
                        <Typography style={{color: theme.palette.primary.dark}}
                                    variant={"subtitle2"}>{formatMoney(check.amount)}</Typography>
                    </ListItemSecondaryAction>
                </PendingCheckPageLink>
                <Divider/>
            </>
        ))
    };

    const getPendingChecks = async () => {
        setLoading(true);
        try {
            const response = await api.get("/admin/deposits/pending");
            const checks = response?.data;
            setPendingChecks(checks);
        } catch (e) {
        }
        setLoading(false);
    }

    useEffect(() => {
        getPendingChecks();
    }, [])

    return (
        <PageWrapper pageName={"Checks control"}>
            <List style={{padding: 10}} dense={true}>
                <ListItemsWrapper placeholderItems={8} hasItems={pendingChecks.length} loading={loading}>
                    {renderPendingChecks()}
                </ListItemsWrapper>
            </List>
        </PageWrapper>
    )
};

export default CheckControlPage;