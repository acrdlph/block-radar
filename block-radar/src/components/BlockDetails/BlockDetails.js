import React from 'react';
import './BlockDetails.css';

const BlockDetails = props => {
    let title;
    let table;
    if (!props.blockNumber) {
        title = (
            <div className="title">
                <h2>Select block to see transactions with value > 0</h2>
            </div>
        );
    } else {
        title = <h2> Block {props.blockNumber}</h2>
        table = (
            <table style={{ margin: 'auto' }}>
                <tbody>
                    <tr>
                        <th>from</th>
                        <th>to</th>
                        <th>value (eth)</th>
                        <th>etherscan</th>
                    </tr>
                    {props.txDetails && props.txDetails.map(tx => {
                        return (
                            <tr key={tx.hash}>
                                <td>{tx.from}</td>
                                <td>{tx.to}</td>
                                <td>{(tx.value / 10 ** 18).toFixed(5)}</td>
                                <td><a href={`https://etherscan.io/tx/${tx.hash}`}>{tx.hash.substring(0, 25) + "..."}</a></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        )
    }

    return (
        <div className="Details sth">
            {title}
            {table}
        </div>
    );
}

export default BlockDetails;