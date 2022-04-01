# Super Staking Test Coverage

## Functionalities

**Network Demand**

  - [ ] Prices can only be recorded if the difference does not exceed `varianceTolerance`
  - [ ] Prices are avaraged out in a certain period of time

**Staking Manager**

  *Staking*

  - [ ] Only able to stake when staking is live
  - [ ] Only approved assets can be staked
  - [ ] Can't stake more than balance
  - [ ] Correct staking parameters (time, poolWeight...) are recorded correctly

  *Unstake*

  - [ ] Only able to unstake when unstaking is live
  - [ ] Only able to unstake when staking amount is greater than unstaking amount
  - [ ] Users are able to unstake, partially and fully
  - [ ] Staking amounts are updated accordingly
  - [ ] When unstaking, rewards can also be claimed

  *Reward & Fee*
  
  - [ ] MDI is constant if not changed
  - [ ] Rewards are calculated correctly in all cases (DF increases, decreases, fluctuates)
  - [ ] Rewards can be claimed partially
  - [ ] Rewards are deducted after being claimed
  - [ ] Fees are collected & distributed correctly
  - [ ] fee percentage can be updated and be different than 25%
  - [ ] fee percentage can be updated without causing any issue to existing fee

**Governance**

  - [ ] Staking Manager cannot be initialized more than once
  - [ ] updates MDI correctly
  - [ ] reflects correct reward if max reward changes
  - [ ] reflects correct reward if program duration changes
  - [ ] program can be extended without affecting reward distribution

## Security

### General

- [ ] Only whitelisted addresses are able to read/write the contracts

### Fund

- [ ] Only staking manager has control over token pool

### Multisig Support

- [ ] Transaction can only be made when all signatures are included