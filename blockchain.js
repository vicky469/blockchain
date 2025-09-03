const Block = require('./block');
const cryptoHash = require('./crypto-hash');

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
      const { timestamp, lastHash, hash, data, nonce, difficulty } = chain[i];
      const lastBlock = chain[i - 1];

      if (
        lastHash !== lastBlock.hash ||
        hash !== cryptoHash(timestamp, lastHash, data, nonce, difficulty)
      ) {
        return false;
      }
    }

    return true;
  }

  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      console.error('The incoming chain must be longer than the current chain.');
      return;
    }

    if (!Blockchain.isValidChain(chain)) {
      console.error('The incoming chain must be valid.');
      return;
    }

    this.chain = chain;
    console.log('Replaced the chain with', chain);
  }
}

module.exports = Blockchain;
