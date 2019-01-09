import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import BlockBox from './components/BlockBox';

const web3 = new Web3(Web3.givenProvider || "https://mainnet.infura.io/v3/f95b0011215b4ae494c029e3da037c24");
web3.eth.getAccounts().then(console.log);

class App extends Component {

  state = {
    blocks: []
  }

  getBlocks = () => {
    let blocks = []
    web3.eth.getBlockNumber()
      .then(latestBlockNumber => {
        for (var i = 0; i < 10; i++) {
          web3.eth.getBlock(latestBlockNumber - i)
            .then(block => {
              blocks.push({
                blockNumber: block.number,
                transactions: block.transactions})
              this.setState({blocks: blocks});
            })
            .catch(err => {
              console.log(err);
            });
        }
      })
      .then(blocks => {
        this.setState({blocks: blocks});
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentDidMount() {
    this.getBlocks();
  }

  componentDidUpdate() {
    console.log(this.state.blocks);
  }

  render() {
    const blocks = this.state.blocks && this.state.blocks.map(block => {
      return (
        <div key={block.blockNumber}>
          <BlockBox blockData={block}/>
        </div>
      );
    })

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
      </div>
    );
  }
}

export default App;
