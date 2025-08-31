const Blockchain = require('./blockchain');
const Block = require('./block');

// Helper function to create a chain with multiple blocks
const addBlocks = (chain) => {
  chain.addBlock({ data: 'Bears' });
  chain.addBlock({ data: 'Beets' });
  chain.addBlock({ data: 'Battlestar Galactica' });
  return chain;
};

describe('Blockchain', () => {
  let blockchain, newChain, originalChain;

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();
    originalChain = blockchain.chain;
  });

  it('contains a `chain` Array instance', () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it('starts with the genesis block', () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it('adds a new block to the chain', () => {
    const newData = 'foo bar';
    blockchain.addBlock({ data: newData });

    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });

  describe('isValidChain()', () => {
    beforeEach(() => {
      blockchain = new Blockchain();
      addBlocks(blockchain);
    });

    const corruptChain = () => {
      const cases = {
        'genesis block replaced': () => {
          blockchain.chain[0] = { data: 'fake-genesis' };
        },
        'a lastHash reference has changed': () => {
          blockchain.chain[2].lastHash = 'broken-lastHash';
        },
        'tampered data': () => {
          blockchain.chain[2].data = 'some-bad-and-evil-data';
        },
      };
      return cases;
    };

    Object.entries(corruptChain()).forEach(([description, corruptFn]) => {
      it(`returns false when ${description}`, () => {
        corruptFn();
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    it('returns true for valid chain', () => {
      expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
    });
  });

  describe('replaceChain()', () => {
    let errorMock, logMock;

    beforeEach(() => {
      errorMock = jest.fn();
      logMock = jest.fn();
      global.console.error = errorMock;
      global.console.log = logMock;
    });

    describe('when the new chain is NOT longer', () => {
      it('does not replace the chain', () => {
        newChain.chain[0] = { new: 'chain' };

        blockchain.replaceChain(newChain.chain);

        expect(blockchain.chain).toEqual(originalChain);
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe('when the new chain is longer', () => {
      beforeEach(() => {
        addBlocks(newChain);
      });

      describe('chain is invalid', () => {
        it('does not replace the chain', () => {
          newChain.chain[2].hash = 'some-fake-hash';

          blockchain.replaceChain(newChain.chain);

          expect(blockchain.chain).toEqual(originalChain);
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe('chain is valid', () => {
        it('replaces the chain', () => {
          blockchain.replaceChain(newChain.chain);

          expect(blockchain.chain).toEqual(newChain.chain);
          expect(logMock).toHaveBeenCalled();
        });
      });
    });
  });
});
