import NumberFormat from "react-number-format";
import React from "react";

function currencyFormatter(value) {
    const amount = new Intl.NumberFormat('en-US', {
        style: "currency",
        currency: "USD"
    }).format(value / 100);

    return `${amount}`;
}

const MoneyInput = (props) => {
    const {inputRef, onChange, ...other} = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            decimalSeparator={","}
            format={currencyFormatter}
            isNumericString
        />
    );
}

export default MoneyInput;