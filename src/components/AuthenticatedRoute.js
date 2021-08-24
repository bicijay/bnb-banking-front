import React from 'react';
import {Route, Redirect} from "react-router-dom";
import useStore from "../store/store";


const AuthenticatedRoute = (props) => {
    const store = useStore(state => state);

    if (!store.userIsLoggedIn) {
        return <Redirect to="/login"/>
    }

    if(!props.admin && store.userIsAdmin) {
        return <Redirect to="/admin"/>
    }

    return (
        <Route {...props}/>
    )
};

export default AuthenticatedRoute;