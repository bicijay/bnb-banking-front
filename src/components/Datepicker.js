import React from 'react';
import {DatePicker} from "@material-ui/pickers";
import {InputAdornment, makeStyles, TextField} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";


const useStyles = makeStyles((theme) => ({
    contrastText: {
        color: "white"
    }
}));

const Datepicker = ({selectedDate, setSelectedDate, alignText}) => {
    const classes = useStyles();

    return (
        <DatePicker
            style={{color: "white"}}
            disableFuture={true}
            openTo="year"
            views={["year", "month"]}
            value={selectedDate}
            onChange={setSelectedDate}
            inputProps={{style: {textAlign: alignText || "right", color: "white"}}}
            TextFieldComponent={
                (props) => <TextField {...props} InputProps={{
                    className: classes.contrastText,
                    endAdornment: <InputAdornment position="end"><ArrowDropDownIcon/></InputAdornment>,
                    disableUnderline: true,
                }}/>
            }
        />
    )
};

export default Datepicker;