import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';

// Three components: 
// 1: BlockBox for displaying block with relative size
// 2: BlockDetails for displaying transactions with msg.value > 0
// 3: TransactionDetails for displaying details about transaction

import BlockBox from './components/BlockBox/BlockBox';
import BlockDetails from './components/BlockDetails/BlockDetails';


const web3 = new Web3(Web3.givenProvider || "https://mainnet.infura.io/v3/f95b0011215b4ae494c029e3da037c24");
web3.eth.getAccounts().then(console.log);

class App extends Component {

  state = {
    blocks: [],
    activeBlock: null
  }

  getBlocks = () => {
    let blocks = [];
    web3.eth.getBlockNumber()
      .then(latestBlockNumber => {
        for (let i = 0; i < 10; i++) {
          web3.eth.getBlock(latestBlockNumber - i)
            .then(block => {
              blocks.push({
                blockNumber: block.number,
                transactions: block.transactions,
                transactionNumber: block.transactions.length
              })
              this.setState({ blocks });
            })
            .catch(err => {
              console.log(err);
            });
        }
      })
      .then(blocks => {
        this.setState({ blocks });
      })
      .catch(err => {
        console.log(err);
      });
  }

  selectBlock = (blockNumber) => {
    // get selected/active block
    const activeBlock = this.state.blocks.filter(block => {
      return block.blockNumber === blockNumber;
    })

    const filteredTransactions = [];

    activeBlock[0].transactions.forEach(txHash => {
      web3.eth.getTransaction(txHash)
      .then(tx => {
        if (tx.value > 0) {
          filteredTransactions.push(tx);
        }
        this.setState({activeBlockTx: filteredTransactions});
      })
    });
    this.setState({
      activeBlock: activeBlock[0].blockNumber,
    });
  }

  selectTransaction = (hash) => {
    
  }

  componentDidMount() {
    this.getBlocks();
  }

  componentDidUpdate() {
  }

  render() {

    let blocks;
    let totalTransactions = 0;

    // only render individual block components, once all blocks have been retrieved
    if (this.state.blocks && this.state.blocks.length === 10) {
      // get the number of total transactions across all 10 blocks in order to display relative block sizes
      for (let i = 0; i < 10; i++) {
        totalTransactions += this.state.blocks[i].transactionNumber;
      }
      blocks = this.state.blocks && this.state.blocks.map(block => {
        return (
          // calculate the width of the box based on the relative transaction volume 
          // (percentage of #transactions in block relative to total #transactions across the 10 blocks)
          <BlockBox
            key={block.blockNumber}
            blockData={block}
            width={Math.floor((block.transactionNumber / totalTransactions) * 100)}
            selectBlock={this.selectBlock}
            active={block.blockNumber === this.state.activeBlock}
          />

        );
      })
    }


    return (
      <div className="App">
        <header className="App-header">
          <p>
            10 latest blocks on the Ethereum mainnet
          </p>
        </header>
        <button onClick={this.getBlocks}>Refresh</button>
        <div className="Blocks">
          {blocks}
        </div>
        <div>
          <BlockDetails
            blockNumber={this.state.activeBlock}
            txDetails={this.state.activeBlockTx} />
        </div>
      </div>
    );
  }
}

export default App;
