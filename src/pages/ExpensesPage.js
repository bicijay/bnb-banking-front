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
    Typography,
    useTheme
} from "@material-ui/core";
import Datepicker from "../components/Datepicker";
import AddIcon from "@material-ui/icons/Add";
import {formatMoney} from "../utils/helpers";
import {useHistory} from "react-router-dom";
import api from "../services/api";
import ListItemsPlaceholder from "../components/ListItemsWrapper";
import ListItemsWrapper from "../components/ListItemsWrapper";
import {format} from "date-fns";

const ExpensesPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    let theme = useTheme();
    let history = useHistory();

    const getExpenses = async () => {
        setLoading(true);
        try {
            const response = await api.get("/customer/purchases", {
                params: {
                    year: selectedDate.getFullYear(),
                    month: selectedDate.getMonth() + 1
                }
            });

            const expenses = response?.data;
            setExpenses(expenses);
        } catch (e) {
        }
        setLoading(false);
    };

    const handleDateChange = (date) => {
        setSelectedDate(new Date(date));
    };

    const renderExpenses = () => {
        return expenses.map((expense) => {
            const expenseAmount = expense.amount;

            return (
                <>
                    <ListItem>
                        <ListItemText primary={expense.description} secondary={format(new Date(expense?.purchased_at),"MM/dd/y hh:mm a")}/>
                        <ListItemSecondaryAction>
                            <Typography style={{color: "red"}}
                                        variant={"subtitle2"}>-{formatMoney(expenseAmount)}</Typography>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider/>
                </>
            )
        });
    }

    useEffect(() => {
        getExpenses();
    }, [selectedDate]);

    return (
        <PageWrapper pageName={"Expenses"}>
            <Grid container style={{backgroundColor: theme.palette.secondary.main, marginTop: -5}} xs={12}>
                <Grid style={{padding: 10, paddingLeft: 20}} xs={6} md={3}>
                    <Datepicker alignText={"center"} setSelectedDate={handleDateChange} selectedDate={selectedDate}/>
                </Grid>
            </Grid>
            <List style={{padding: 10}} dense={true}>
                <ListItemsWrapper loading={loading} placeholderItems={8} hasItems={expenses.length}>
                    {renderExpenses()}
                </ListItemsWrapper>
            </List>
            <Fab onClick={() => history.push("/purchases/create")} style={{
                margin: 0,
                top: 'auto',
                right: 20,
                bottom: 20,
                left: 'auto',
                position: 'absolute',
            }} color="primary" aria-label="add">
                <AddIcon/>
            </Fab>
        </PageWrapper>
    )
};

export default ExpensesPage;