
import React, { useMemo } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import WalletRow from './WalletRow';
import { useWalletBalances, usePrices } from './hooks';
import { makeStyles } from '@mui/styles';

//add useStyles
const useStyles = makeStyles({
    row: {
        // styling here
    },
});


// add Blockchain type
type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';

interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: Blockchain; //add blockchain property
}

// Rename Props to WalletPageProps for clarity.
interface WalletPageProps extends BoxProps {
    // add children prop (React 18+)
    children?: React.ReactNode;
}

// Move getPriority outside the component since it's a pure function.
// refector getPriority function:
// update any type to Blockchain type
// using object to get value instead switch case
const getPriority = (blockchain: Blockchain): number => {
    const priorities: Record<Blockchain, number> = {
        Osmosis: 100,
        Ethereum: 50,
        Arbitrum: 30,
        Zilliqa: 20,
        Neo: 20,
    };
    return priorities[blockchain] ?? -99;
};

const WalletPage: React.FC<WalletPageProps> = (props: WalletPageProps) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    //add useStyles
    const classes = useStyles();

    const sortedBalances = useMemo(() => {
        return balances.filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            //Fix bug: rename lhsPriority to balancePriority
            //Fix bug: balance amount should be greater than 0
            //return condition directly instead of using if else
            return balancePriority > -99 && balance.amount > 0;

        }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
            const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);

            //refactor to return rightPriority - leftPriority
            return rightPriority - leftPriority;
        });
        //remove prices from dependencies array to avoid re-render if prices change
    }, [balances]);

    //use useMemo to store rows and avoid re-render
    const rows = useMemo(() => {
        return sortedBalances.map((balance: WalletBalance) => {
            const usdValue = prices[balance.currency] * balance.amount;
            return (
                <WalletRow
                    className={classes.row}
                    // Use a unique key instead of index
                    key={`${balance.currency}-${balance.blockchain}`}
                    amount={balance.amount}
                    usdValue={usdValue}
                    //remove FormattedWalletBalance type and use formattedAmount directly
                    formattedAmount={balance.amount.toFixed(2)}
                />
            )
        })
    }, [sortedBalances, prices, classes.row]);

    return (
        <Box {...rest}>
            {rows}
            {/* add children */}
            {children}
        </Box>
    )
}

//export WalletPage
export default WalletPage;