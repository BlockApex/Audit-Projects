# DAFI Staking V2 

### property testing

run tests by running 

``` dapp testnet ``` 
in a terminal

go to `contracts/blockapex/dapping/test.sh`
copy the account address from dapp testnet terminal to ETH_FROM=[ACCOUNT-ADDRESS here] in the ./test.sh file

go to contracts/blockapex/dapping/ from another terminal;

run `./test.sh`
resolve errors of imports by specifying correct (absolute paths) then run `./test.sh` from the same terminal location
