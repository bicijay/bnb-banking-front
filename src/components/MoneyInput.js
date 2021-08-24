import NumberFormat from "react-number-format";
import React from "react";

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
            decimalScale={2}
            fixedDecimalScale={true}
            isNumericString
        />
    );
}

export default MoneyInput;