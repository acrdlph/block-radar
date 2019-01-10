// This component connects to the Ethereum blockchain, fetches data for last 10 blocks, and renders
// the two stateless/presentational components as needed.

import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';

import BlockBox from '../components/BlockBox/BlockBox'; // Stateless component for summary display of all blocks / selection panel
import BlockDetails from '../components/BlockDetails/BlockDetails'; // Stateless component for viewing transactions in selected block

// Initialize web3 with MetaMask provider OR with Infura remote node if MetaMask is not installed
// NOTE: With MetaMask, the user can switch between mainnet and the various test networks;
// without MetaMask, the app will be restricted to the mainnet
const web3 = new Web3(Web3.givenProvider || "https://mainnet.infura.io/v3/f95b0011215b4ae494c029e3da037c24");

class App extends Component {

  state = {
    blocks: [], // summary information about last 10 blocks
    activeBlock: null, // number of the block currently selected for detail view
    web3Connected: false, // boolean to determine if connection to blockchain is established
    networkName: '' // name of the Ethereum network
  }

  componentDidMount() {

    // Only continue if Web3 was successfully initialized with a provider
    if (!web3.currentProvider) {
      this.setState({ web3Connected: false });
      return
    } else {
      this.setState({ web3Connected: true });

      // Identify which network MetaMask is connected to:
      this.getNetwork()

      // Make sure this gets updated when the user switches networks with MetaMask
      web3.currentProvider.isMetaMask && web3.currentProvider.publicConfigStore.on('update', () => {
        this.getNetwork()
      })

      // Retrieve the last 10 blocks
      this.getBlocks();
    }
  }

  getNetwork = () => {
    let networkName = '';
    web3.eth.net.getId()
      .then(netId => {
        switch (netId) {
          case 1:
            networkName = "Ethereum Mainnet";
            break;
          case 2:
            networkName = "Morden Testnet";
            break;
          case 3:
            networkName = "Ropsten Testnet";
            break;
          case 4:
            networkName = "Rinkeby Testnet";
            break;
          case 42:
            networkName = "Kovan Testnet";
            break;
          default:
            networkName = "Unknown";
        }
        this.setState({
          networkName
        })
      })
      .catch(err => {
        console.log(err);
      })
  }

  getBlocks = () => {
    let blocks = [];
    web3.eth.getBlockNumber() // returns promise that resolves to the block number of the latest block
      .then(latestBlockNumber => {
        // loop through the last 10 blocks and call web3.eth.getBlock on each to get block details
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
      .catch(err => {
        console.log(err);
      });
  }

  selectBlock = (blockNumber) => {

    // determine the block that was selected and save it as activeBlock
    // javascript filter method returns array even when only one matching element is found
    // --> take first element
    const activeBlock = this.state.blocks.filter(block => {
      return block.blockNumber === blockNumber;
    })[0];
    this.setState({ activeBlock: activeBlock.blockNumber });

    // activeBlock.transactions has an array of transaction hashes but no transaction details
    // loop through all transaction hashes and call web3.eth.getTransaction on each to push details into a new array
    const filteredTransactions = [];
    activeBlock.transactions.forEach(txHash => {
      web3.eth.getTransaction(txHash)
        .then(tx => {
          // remove transactions which had no ether value attached
          if (tx.value > 0) {
            filteredTransactions.push(tx);
          }
          this.setState({ activeBlockTx: filteredTransactions });
        })
    });
  }

  render() {

    let blocks;
    let totalTransactions = 0;

    // In the block selection panel, individual blocks are sized according to their relative transaction volume
    // (width of block = percentage of #transactions in block relative to total #transactions across the 10 blocks)
    // so we need the total transaction volume before computing the correct size)
    // --> only render this component, once all blocks have been retrieved.
    if (this.state.blocks && this.state.blocks.length === 10) {
      // get the number of total transactions across all 10 blocks
      for (let i = 0; i < 10; i++) {
        totalTransactions += this.state.blocks[i].transactionNumber;
      }
      blocks = this.state.blocks.map(block => {
        return (
          // When calculating the width of each BlockBox, I take Math.floor to always fill slightly less than 
          // 100% of the available width, so all boxes will always fit the screen.
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

    // the app is viewable even without MetaMask thanks to the remote infura node.
    // nevertheless, i display a message to nudge the user towards using MetaMask for advanced functionality
    // (e.g. network switching) and decreased reliance on infura
    const metamaskMessage =
      web3.currentProvider.isMetaMask
        ? null
        : (<p className="App-header__metamask">
            (Activate 
            <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
              Metamask
            </a> 
            <br />
            for more options)
          </p>);

    return (
      <div className="App">

        <header className="App-header">
          <div className="App-header__network">
            <b>Connected</b>
            <br />
            {this.state.networkName}
            {metamaskMessage}
          </div>
          <div className="App-header__title">
            LAST 10 ETHEREUM BLOCKS
          </div>
          <button onClick={this.getBlocks}>
            Refresh
          </button>
        </header>

        <div className="App-blockBoxes">
          {blocks}
        </div>

        <div className="App-blockDetails">
          {this.state.web3Connected
            ? <BlockDetails
              blockNumber={this.state.activeBlock}
              txDetails={this.state.activeBlockTx} />
            : null}
        </div>

      </div>
    );
  }
}

export default App;
