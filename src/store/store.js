import create from 'zustand'

const useStore = create(set => ({
        userIsLoggedIn: false,
        userIsAdmin: false,
        currentBalance: null,
        currentIncomes: null,
        currentExpenses: null,

        setUserBalance: (balanceData) => set(state => ({ ...balanceData })),
        logoutUser: () => set(state => ({ userIsLoggedIn: false })),
        loginUser: (isAdmin) => set(state => ({ userIsLoggedIn: true, userIsAdmin: isAdmin })),
    }
));

export default useStore;