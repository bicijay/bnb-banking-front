import React, {useEffect, useState} from 'react';
import PageWrapper from "../../components/PageWrapper";
import {Button, Grid, InputAdornment, TextField, useTheme} from "@material-ui/core";
import MoneyInput from "../../components/MoneyInput";
import {useHistory, useParams} from "react-router-dom";
import api from "../../services/api";
import ProtectedImage from "../../components/ProtectedImage";
import {useSnackbar} from "notistack";


const CheckDetails = () => {
    let history = useHistory();
    let {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [currentDeposit, setCurrentDeposit] = useState(false);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const getDepositDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/admin/deposits/${id}`);
            const deposit = response?.data;
            setCurrentDeposit(deposit);
        } catch (e) {
        }
        setLoading(false);
    };

    const reviewDeposit = async (accepted) => {
        setLoading(true);
        try {
            await api.put(`/admin/deposits/${id}/review`, {
                accepted: accepted
            });

            enqueueSnackbar("The deposit was reviewed successfully.", {variant: "success"});
            history.push("/admin");
        } catch (e) {
            showError(e.response?.data?.message);
        }
        setLoading(false);
    }

    const showError = (message = "An internal error has occurred") => {
        enqueueSnackbar(message, {variant: "error",})
    };

    useEffect(() => {
        getDepositDetails();
    }, [])

    return (
        <PageWrapper pageName={"Review deposit"}>
            <Grid style={{padding: 20, paddingTop: 40}} xs={12}>
                <TextField
                    label={"USERNAME"}
                    fullWidth={true}
                    value={currentDeposit?.user?.username}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"></InputAdornment>,
                        readOnly: true,
                    }}
                />
                <TextField
                    style={{marginTop: 40}}
                    label={"USER EMAIL"}
                    fullWidth={true}
                    value={currentDeposit?.user?.email}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"></InputAdornment>,
                        readOnly: true,
                    }}
                />
                <TextField
                    style={{marginTop: 40}}
                    label={"DESCRIPTION"}
                    fullWidth={true}
                    value={currentDeposit?.description}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"></InputAdornment>,
                        readOnly: true,
                    }}
                />
                <TextField
                    style={{marginTop: 40}}
                    label={"AMOUNT"}
                    fullWidth={true}
                    value={currentDeposit?.amount}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"></InputAdornment>,
                        inputComponent: MoneyInput,
                        readOnly: true,
                    }}
                />
                <Grid container justifyContent={"center"} style={{marginTop: 30}}>
                    <ProtectedImage imageId={currentDeposit?.image?.id}
                                    style={{maxHeight: 400, width: 'auto', maxWidth: '100%'}}/>
                </Grid>
                <Grid xs={12} container>
                    <Grid style={{padding: 5}} xs={6}>
                        <Button onClick={() => reviewDeposit(false)} fullWidth style={{marginTop: 30}} type="submit" variant="outlined" color="primary">
                            REJECT
                        </Button>
                    </Grid>
                    <Grid style={{padding: 5}} xs={6}>
                        <Button onClick={() => reviewDeposit(true)} fullWidth style={{marginTop: 30}} type="submit" variant="contained" color="primary">
                            ACCEPT
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </PageWrapper>
    )
};

export default CheckDetails;