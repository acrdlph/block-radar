This project is a code challenge for a frontend developer application.

## Description

This is a minimal block explorer built with React and Web3 (bootstrapped using create-react-app).
It displays the last 10 blocks of Ethereum in a visually meaningful way and allows the user to view 
the transactions of each block (only transactions which send some Ether value are displayed).

The app consists of 1 stateful components and 2 presentational components: 
//
### App.js(stateful)
Stateful component: Connects to the Ethereum blockchain to fetch data and pass it to presentational components as needed.

### BlockBox
Stateless component: Shows the last 10 blocks on a "timeline" panel for the user to select one.
The blocks are sized to visually represent the size (relative transaction volume) of the corresponding block

### BlockDetails
Stateless component: Lists all transactions from the selected block
which have value > 0 (i.e. Ether was sent with these transactions) in a table with some details 
(to, from, value, etherscan link).

## How to run it


### MetaMask

Activate MetaMask on the network, that you are interested in. (If MetaMask is not installed, this app will use an Infura node to display  data from the mainnet by default.)

### `npm install`

### `npm start`

Refresh to get the latest block data.


