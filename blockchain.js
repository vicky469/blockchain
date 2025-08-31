const Block = require("./block");
const cryptoHash = require("./crypto-hash");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data,
    });

    this.chain.push(newBlock);
  }

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];

      if (
        block.lastHash !== lastBlock.hash ||
        block.hash !== cryptoHash(block.timestamp, block.lastHash, block.data)
      ) {
        return false;
      }
    }

    return true;
  }
  
  replaceChain(chain) {
    // Don't replace with a shorter or equal length chain
    if (chain.length <= this.chain.length) {
      return;
    }
    
    // Don't replace with an invalid chain
    if (!Blockchain.isValidChain(chain)) {
      return;
    }
    
    // Replace the chain if it's longer and valid
    this.chain = chain;
  }
}

module.exports = Blockchain;
