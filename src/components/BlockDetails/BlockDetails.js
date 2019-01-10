import React from 'react';
import './BlockDetails.css';

// This component displays a list of transactions and 
// some details for each transaction for the selected block

const BlockDetails = props => {
    let title;
    let table;
    // display instructions, if no block has been selected as activeBlock, yet
    if (!props.blockNumber) {
        title = (
            <div className="BlockDetails-title">
                <h2>Select block to see transactions</h2>
                <h4>(with value > 0)</h4>
            </div>
        );
    } else {
        // otherwise display blocknumber and table with transaction details
        // (and a link to Etherscan for even more details)
        title = (
            <div className="BlockDetails-title">
                <h2> Block #{props.blockNumber}</h2>
            </div>
        );
        table = (
            <table className="BlockDetails-table">
                <tbody>
                    <tr>
                        <th>From</th>
                        <th>To</th>
                        <th>Value (ETH)</th>
                        <th>Etherscan</th>
                    </tr>
                    {props.txDetails && props.txDetails.map(tx => {
                        return (
                            <tr key={tx.hash}>
                                <td>{tx.from}</td>
                                <td>{tx.to}</td>
                                <td>{(tx.value / 10 ** 18).toFixed(5)}</td>
                                <td>
                                    <a href={`https://etherscan.io/tx/${tx.hash}`}>
                                        {tx.hash.substring(0, 25) + "..."}
                                    </a>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        )
    }

    return (
        <div>
            {title}
            {table}
        </div>
    );
}

export default BlockDetails;