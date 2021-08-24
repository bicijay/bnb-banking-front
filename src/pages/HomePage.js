import React, {useEffect, useState} from 'react';
import PageWrapper from "../components/PageWrapper";
import {
    Button,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    Typography, useTheme
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import {blue} from "@material-ui/core/colors";
import Datepicker from "../components/Datepicker";
import {formatMoney} from "../utils/helpers";
import {useHistory} from "react-router-dom";
import api from "../services/api";
import useStore from "../store/store";
import ListItemsWrapper from "../components/ListItemsWrapper";
import { format } from 'date-fns'


const EXPENSE_TYPE = "expense";

const useStyles = makeStyles((theme) => ({
    balanceRow: {
        padding: 20,
        marginTop: -5,
    },
    balanceRowButton: {
        justifyContent: "center",
        alignItems: "center"
    },
    textColor: {
        color: theme.palette.primary.dark
    },
    currentBalanceRow: {
        backgroundColor: theme.palette.secondary.main,
        padding: "15px 20px 20px",
        marginTop: -5,
    },
    contrastText: {
        color: "white"
    },
}));

const BalanceRow = ({amount, label, actionText, color, route}) => {
    const classes = useStyles();
    let history = useHistory();

    return (
        <Grid style={{backgroundColor: color}} className={classes.balanceRow} container xs={12}>
            <Grid style={{paddingTop: 10}} xs={9} md={11}>
                <Typography className={classes.textColor} variant="subtitle2">{label}</Typography>
                <Typography className={classes.textColor} variant="h6">{formatMoney(amount)}</Typography>
            </Grid>
            <Grid justifyContent={"center"} container xs={3} md={1}>
                <Button onClick={() => history.push(route)}>
                    <Grid container justifyContent={"center"} xs={12}>
                        <Grid item xs={12}>
                            <AddIcon className={classes.textColor} fontSize={"medium"}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography className={classes.textColor} variant={"button"}>{actionText}</Typography>
                        </Grid>
                    </Grid>
                </Button>
            </Grid>
        </Grid>
    )
}

const CurrentBalanceRow = ({amount, selectedDate, setSelectedDate}) => {
    const classes = useStyles();

    return (
        <Grid className={classes.currentBalanceRow} container xs={12}>
            <Grid style={{paddingTop: 10}} xs={6}>
                <Typography className={classes.contrastText} variant={"subtitle2"}>Current balance</Typography>
                <Typography className={classes.contrastText} variant="h5">{formatMoney(amount)}</Typography>
            </Grid>
            <Grid justifyContent={"flex-end"} alignContent={"flex-end"} container xs={6}>
                <Datepicker selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
            </Grid>
        </Grid>
    )
}

const HomePage = () => {
    const store = useStore(state => state);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const theme = useTheme();

    const getTransactions = async () => {
        setLoading(true);
        try {
            const response = await api.get("/customer/transactions", {
                params: {
                    year: selectedDate.getFullYear(),
                    month: selectedDate.getMonth() + 1
                }
            });
            const transactions = response?.data;
            setTransactions(transactions);
        } catch (e) {
        }
        setLoading(false);
    };

    const getUserBalance = async () => {
        try {
            const response = await api.get("/customer/user-balance");
            const balance = response.data;

            store.setUserBalance({
                currentBalance: balance.current_balance,
                currentIncomes: balance.total_incomes,
                currentExpenses: balance.total_expenses,
            })
        } catch (e) {
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(new Date(date));
    };

    const renderTransactions = () => {
        return transactions.map((transaction) => {
            const transactionIsNegative = transaction.type === EXPENSE_TYPE;
            const transactionAmount = transaction.amount;

            return (
                <>
                    <ListItem>
                        <ListItemText primary={transaction.description} secondary={format(new Date(transaction?.transaction_at),"MM/dd/y hh:mm a")}/>
                        <ListItemSecondaryAction>
                            <Typography style={{color: transactionIsNegative ? "red" : theme.palette.primary.dark}}
                                        variant={"subtitle2"}>{transactionIsNegative && "-"}{formatMoney(transactionAmount)}</Typography>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider/>
                </>
            )
        })
    }

    useEffect(() => {
        getUserBalance();
    }, []);

    useEffect(() => {
        getTransactions();
    }, [selectedDate])

    return (
        <PageWrapper pageName={"Home"}>
            <CurrentBalanceRow amount={store.currentBalance} selectedDate={selectedDate}
                               setSelectedDate={handleDateChange}/>
            <BalanceRow color={blue[100]} amount={store.currentIncomes} label={"Incomes"} actionText={"DEPOSIT"}
                        route="/checks/deposit"/>
            <BalanceRow color={blue[50]} amount={store.currentExpenses} label={"Expenses"} actionText={"PURCHASE"}
                        route="/purchases/create"/>
            <Typography color={"secondary"} variant="subtitle2"
                        style={{paddingTop: 25, paddingLeft: 15}}>TRANSACTIONS</Typography>
            <List style={{padding: 10}} dense={true}>
                <ListItemsWrapper placeholderItems={5} loading={loading} hasItems={transactions.length}>
                    {renderTransactions()}
                </ListItemsWrapper>
            </List>
        </PageWrapper>
    )
};

export default HomePage;