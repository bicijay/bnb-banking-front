import { format, parseISO } from 'date-fns'

export const formatMoney = (amount) => {
    if (!Number.isInteger(amount)) {
        return "$ -"
    }

    amount = amount / 100;
    amount = amount.toFixed(2).toString().replace(".", ",");

    return `$${amount}`
}

export const formatDate = (date) => {
    if(!date) return "-";

    return format(parseISO(date), "MM/dd/y hh:mm a");
}