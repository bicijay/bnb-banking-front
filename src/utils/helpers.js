export const formatMoney = (amount) => {
    if (!Number.isInteger(amount)) {
        return "$ -"
    }

    amount = amount / 100;
    amount = amount.toFixed(2).toString().replace(".", ",");

    return `$${amount}`
}