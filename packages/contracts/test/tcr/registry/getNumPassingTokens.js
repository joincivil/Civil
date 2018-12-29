/* eslint-env mocha */
/* global contract assert artifacts */

const PLCRVoting = artifacts.require('./PLCRVoting.sol');
const EIP20 = artifacts.require('tokens/eip20/EIP20.sol');

const utils = require('./utils.js');
const BN = require('bignumber.js');

contract('PLCRVoting', (accounts) => {
  describe('Function: getNumPassingTokens', () => {
    const [alice, bob] = accounts;
    let plcr;
    let token;

    before(async () => {
      registry = await utils.createAllTestAddressRegistryInstance(accounts);
      const votingAddress = await registry.voting();
      plcr = await PLCRVoting.at(votingAddress);
    });

    // describe('should correctly return the number of tokens that voted for the winning option', () => {
    //   it('voting for', async () => {
    //     const options = utils.defaultOptions();
    //     options.actor = alice;
    //     options.vote = '1';

    //     const pollID = await utils.startPollAndCommitVote(options, plcr);
    //     await utils.increaseTime(new BN(options.commitPeriod, 10).add(new BN('1', 10)).toNumber(10));

    //     await utils.as(options.actor, plcr.revealVote, pollID, options.vote, options.salt);
    //     await utils.increaseTime(new BN(options.revealPeriod, 10).add(new BN('1', 10)).toNumber(10));

    //     const passingTokens = await plcr.getNumPassingTokens.call(options.actor, pollID);

    //     assert.strictEqual(passingTokens.toString(), options.numTokens,
    //       'number of winning tokens were not equal to commited tokens');
    //   });

    //   it('voting against', async () => {
    //     const options = utils.defaultOptions();
    //     options.actor = alice;
    //     options.vote = '0';

    //     const pollID = await utils.startPollAndCommitVote(options, plcr);
    //     await utils.increaseTime(new BN(options.commitPeriod, 10).add(new BN('1', 10)).toNumber(10));

    //     await utils.as(options.actor, plcr.revealVote, pollID, options.vote, options.salt);
    //     await utils.increaseTime(new BN(options.revealPeriod, 10).add(new BN('1', 10)).toNumber(10));

    //     const passingTokens = await plcr.getNumPassingTokens.call(options.actor, pollID);

    //     assert.strictEqual(passingTokens.toString(), options.numTokens,
    //       'number of winning tokens were not equal to commited tokens');
    //   });
    // });

    // it('should revert if the poll queried has not yet ended', async () => {
    //   const options = utils.defaultOptions();
    //   options.actor = alice;
    //   options.vote = '0';

    //   // make a poll and commit
    //   const pollID = await utils.startPollAndCommitVote(options, plcr);

    //   // call before reveal end date
    //   try {
    //     await plcr.getNumPassingTokens.call(options.actor, pollID);
    //   } catch (err) {
    //     assert(utils.isEVMException(err), err.toString());
    //     return;
    //   }
    //   assert(false, 'was able to call getNumPassingTokens on a poll that was not finished');
    // });

    // it('should revert if the voter has not yet revealed a vote for the given poll', async () => {
    //   const options = utils.defaultOptions();
    //   options.actor = alice;
    //   options.vote = '0';

    //   // make a poll and commit
    //   const pollID = await utils.startPollAndCommitVote(options, plcr);

    //   // end the poll, but do not reveal
    //   const increase = new BN(options.commitPeriod, 10)
    //     .add(new BN(options.revealPeriod, 10))
    //     .add('1');
    //   await utils.increaseTime(increase.toNumber(10));

    //   // make sure the poll has ended
    //   const ended = plcr.pollEnded.call(pollID);
    //   assert(ended, 'poll has not ended!');

    //   // call
    //   try {
    //     await plcr.getNumPassingTokens.call(options.actor, pollID);
    //   } catch (err) {
    //     assert(utils.isEVMException(err), err.toString());
    //     return;
    //   }
    //   assert(false, 'was able to call getNumPassingTokens on a poll without revealing a vote');
    // });

    it('should return 0 if the queried tokens were committed to the minority bloc', () => {
      it('voting for', async () => {
        const options = utils.defaultOptions();
        options.actor = alice;
        options.vote = '1';
        options.numTokens = '100';

        const loserOptions = utils.defaultOptions();
        loserOptions.actor = bob;
        loserOptions.vote = '0';
        loserOptions.numTokens = '5';

        const pollID = await plcr.startPoll("50", "100", "100"); //utils.startPollAndCommitVote(options, plcr);
        await plcr.commitVote(pollID, loserOptions, plcr);
        await utils.increaseTime(new BN("100", 10).add(new BN('1', 10)).toNumber(10));

        await utils.as(options.actor, plcr.revealVote, pollID, options.vote, options.salt);
        await utils.increaseTime(new BN("100", 10).add(new BN('1', 10)).toNumber(10));

        // const passingTokens = await plcr.getNumPassingTokens.call(options.actor, pollID);
        const loserPassingTokens = await plcr.getNumPassingTokens.call(loserOptions.actor, pollID);

        // assert.strictEqual(passingTokens.toString(), options.numTokens,
        //   'number of winning tokens were not equal to commited tokens');
        assert.strictEqual(loserPassingTokens.toString(), '0', 'number of winning tokens for losing voter were not equal to 0');
      });
    });
  });
});

