import React from 'react';
import './BlockBox.css';

const BlockBox = props => {
    const classes = props.active ? "BlockBox active" : "BlockBox";
    return (
        // use flexbox order property to show latest block (highest block number) one the very left
        <div
            className={classes}
            style={{ width: `${props.width}%`, order: -props.blockData.blockNumber }}
            onClick={() => props.selectBlock(props.blockData.blockNumber)}
        >
            <p className="BlockNumber">
                #{props.blockData.blockNumber}
            </p>
        </div>
    )
};

export default BlockBox;