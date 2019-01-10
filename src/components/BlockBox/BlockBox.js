// This component shows the last 10 blocks in a visually meaningful manner and
// allows the user to select one in order to open the BlockDetails for it.

import React from 'react';
import './BlockBox.css';

const BlockBox = props => {
    const boxStyle = props.active ? "BlockBox active" : "BlockBox";
    return (
        // use inline styling to dynamically set the width and position of each box
        // use flexbox order property to show latest block (highest block number) on the very left
        // (so that we get a chronologically ordered panel / block timeline);
        <div
            className={boxStyle}
            style={{ width: `${props.width}%`, order: -props.blockData.blockNumber }}
            onClick={() => props.selectBlock(props.blockData.blockNumber)}
        >
            <p className="BlockBox-blockNumber">
                #{props.blockData.blockNumber}
            </p>
        </div>
    )
};

export default BlockBox;