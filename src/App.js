import HomePage from "./pages/HomePage";
import {
    BrowserRouter as Router,
    Switch,
    Route, useHistory, withRouter,
} from "react-router-dom";
import ExpensesPage from "./pages/ExpensesPage";
import ChecksPage from "./pages/ChecksPage";
import {createTheme} from "@material-ui/core";
import DateFnsUtils from '@date-io/date-fns';
import {ThemeProvider} from '@material-ui/core/styles';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import CreatePurchasePage from "./pages/CreatePurchasePage";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import {SnackbarProvider} from 'notistack';
import DepositCheckPage from "./pages/DepositCheckPage";
import CheckControlPage from "./pages/Admin/CheckControlPage";
import CheckDetails from "./pages/Admin/CheckDetails";

const theme = createTheme({
    palette: {
        primary: {
            light: '#63a4ff',
            main: '#1976d2',
            dark: '#004ba0',
            contrastText: '#ffffff',
        },
        secondary: {
            light: '#5e91f2',
            main: '#1564bf',
            dark: '#003b8e',
            contrastText: '#ffffff',
        }
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <SnackbarProvider maxSnack={3}>
                    <Router>
                        <Switch>
                            <Route path="/login">
                                <LoginPage/>
                            </Route>
                            <Route path="/register">
                                <RegisterPage/>
                            </Route>
                            <AuthenticatedRoute path="/" exact={true}>
                                <HomePage/>
                            </AuthenticatedRoute>
                            <AuthenticatedRoute path="/expenses">
                                <ExpensesPage/>
                            </AuthenticatedRoute>
                            <AuthenticatedRoute path="/checks" exact={true}>
                                <ChecksPage/>
                            </AuthenticatedRoute>
                            <AuthenticatedRoute path="/checks/deposit">
                                <DepositCheckPage/>
                            </AuthenticatedRoute>
                            <AuthenticatedRoute path="/purchases/create">
                                <CreatePurchasePage/>
                            </AuthenticatedRoute>

                            <AuthenticatedRoute exact={true} admin={true} path="/admin">
                                <CheckControlPage/>
                            </AuthenticatedRoute>
                            <AuthenticatedRoute admin={true} path="/admin/deposit/:id/review/">
                                <CheckDetails/>
                            </AuthenticatedRoute>
                        </Switch>
                    </Router>
                </SnackbarProvider>
            </MuiPickersUtilsProvider>
        </ThemeProvider>
    );
}

export default App;
