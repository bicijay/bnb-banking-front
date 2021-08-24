import React, {useEffect, useState} from 'react';
import PageWrapper from "../components/PageWrapper";
import {
    Divider,
    Fab,
    Grid,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Paper,
    Tab,
    Tabs,
    Typography,
    useTheme
} from "@material-ui/core";
import Datepicker from "../components/Datepicker";
import AddIcon from "@material-ui/icons/Add";
import {useHistory} from "react-router-dom";
import ListItemsPlaceholder from "../components/ListItemsWrapper";
import api from "../services/api";
import {formatMoney} from "../utils/helpers";
import ListItemsWrapper from "../components/ListItemsWrapper";
import {format} from "date-fns";

const TabPanel = ({children, index, current}) => {
    if (index === current) {
        return children;
    }

    return null;
};

const ChecksPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = React.useState(0);
    const [checks, setChecks] = useState([]);
    let theme = useTheme();
    let history = useHistory();

    const pendingChecks = checks.filter((check) => check.status === "pending");
    const acceptedChecks = checks.filter((check) => check.status === "accepted");
    const rejectedChecks = checks.filter((check) => check.status === "rejected");

    const handleDateChange = (date) => {
        setSelectedDate(new Date(date));
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const getChecks = async () => {
        setLoading(true);
        try {
            const response = await api.get("/customer/deposits", {
                params: {
                    year: selectedDate.getFullYear(),
                    month: selectedDate.getMonth() + 1
                }
            });

            const checks = response?.data;
            setChecks(checks);
        } catch (e) {
        }
        setLoading(false);
    };

    const renderChecks = (checks) => {
        return checks.map((check) => (
            <>
                <ListItem>
                    <ListItemText primary={check.description} secondary={format(new Date(check.created_at),"MM/dd/y hh:mm a")}/>
                    <ListItemSecondaryAction>
                        <Typography style={{color: theme.palette.primary.dark}}
                                    variant={"subtitle2"}>{formatMoney(check.amount)}</Typography>
                    </ListItemSecondaryAction>
                </ListItem>
                <Divider/>
            </>
        ))
    }

    useEffect(() => {
        getChecks();
    }, [selectedDate]);

    return (
        <PageWrapper pageName={"Checks"}>
            <Grid container style={{backgroundColor: theme.palette.secondary.main, marginTop: -5}} xs={12}>
                <Grid style={{padding: 10, paddingLeft: 20}} xs={6} md={3}>
                    <Datepicker alignText={"center"} setSelectedDate={handleDateChange} selectedDate={selectedDate}/>
                </Grid>
            </Grid>
            <Tabs
                value={selectedTab}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleTabChange}
                variant="fullWidth"
            >
                <Tab label="PENDING"/>
                <Tab label="ACCEPTED"/>
                <Tab label="REJECTED"/>
            </Tabs>
            <TabPanel current={selectedTab} index={0}>
                <List style={{padding: 10}} dense={true}>
                    <ListItemsWrapper placeholderItems={8} hasItems={pendingChecks.length} loading={loading}>
                        {renderChecks(pendingChecks)}
                    </ListItemsWrapper>
                </List>
            </TabPanel>
            <TabPanel current={selectedTab} index={1}>
                <List style={{padding: 10}} dense={true}>
                    <ListItemsWrapper placeholderItems={8} hasItems={acceptedChecks.length} loading={loading}>
                        {renderChecks(acceptedChecks)}
                    </ListItemsWrapper>
                </List>
            </TabPanel>
            <TabPanel current={selectedTab} index={2}>
                <List style={{padding: 10}} dense={true}>
                    <ListItemsWrapper placeholderItems={8} hasItems={rejectedChecks.length} loading={loading}>
                        {renderChecks(rejectedChecks)}
                    </ListItemsWrapper>
                </List>
            </TabPanel>
            <Fab onClick={() => history.push("/checks/deposit")} style={{
                margin: 0,
                top: 'auto',
                right: 20,
                bottom: 20,
                left: 'auto',
                position: 'fixed',
            }} color="primary" aria-label="add">
                <AddIcon/>
            </Fab>
        </PageWrapper>
    )
};

export default ChecksPage;