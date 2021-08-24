import React from 'react';
import {Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles, Typography} from "@material-ui/core";
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {useHistory, useRouteMatch} from "react-router-dom";
import useStore from "../store/store";


const useStyles = makeStyles((theme) => ({
    list: {
        width: 280,
        backgroundColor: theme.palette.primary
    },
    drawerHeader: {
        margin: 30,
    }
}));

const ListPageLink = (props) => {
    let history = useHistory();
    let match = useRouteMatch({
        path: props?.to,
        exact: true
    });

    return <ListItem onClick={() => history.push(props.to)} selected={match} {...props}/>
};

const DrawerMenu = (props) => {
    let history = useHistory();
    const classes = useStyles();
    const store = useStore(state => state);

    const toggleDrawer = (open) => {
        props?.toggleDrawer(open);
    };

    const logout = () => {
        localStorage.removeItem("auth_token");
        store.logoutUser();
        history.push("/login");
    };

    return (
        <Drawer anchor="left" open={props.open} onClose={() => toggleDrawer(false)}>
            <List className={classes.list} component="nav" aria-label="main mailbox folders">
                <div>
                    <Typography variant="h5" className={classes.drawerHeader} align="center">
                        BnB Bank
                    </Typography>
                </div>
                {store.userIsAdmin ?
                    <>
                        <ListPageLink to="/admin" button>
                            <ListItemIcon>
                                <LocalAtmIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Pending checks"/>
                        </ListPageLink>
                    </>
                    :
                    <>
                        <ListPageLink to="/" button>
                            <ListItemIcon>
                                <AccountBalanceIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Balance"/>
                        </ListPageLink>
                        <ListPageLink to="/expenses" button>
                            <ListItemIcon>
                                <ArrowDownwardIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Expenses"/>
                        </ListPageLink>
                        <ListPageLink to="/checks" button>
                            <ListItemIcon>
                                <LocalAtmIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Checks"/>
                        </ListPageLink>
                    </>
                }
                <ListItem onClick={logout} button>
                    <ListItemIcon>
                        <ExitToAppIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Logout"/>
                </ListItem>
            </List>
        </Drawer>
    )
};

export default DrawerMenu;