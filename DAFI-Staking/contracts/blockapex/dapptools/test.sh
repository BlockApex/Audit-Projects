#!/usr/bin/env bash

# Make dependencies available
# export DAPP_REMAPPINGS=$(cat remapping.txt)
export DAPP_SOLC_VERSION=0.8.0

# # If you're getting an "invalid character at offset" error, comment this out.
export DAPP_LINK_TEST_LIBRARIES=0
export DAPP_TEST_VERBOSITY=3
export DAPP_TEST_SMTTIMEOUT=500000

# Optimize your contracts before deploying to reduce runtime execution costs.
export DAPP_BUILD_OPTIMIZE=1
export DAPP_BUILD_OPTIMIZE_RUNS=100000

export DAPP_COVERAGE= true

# export DEEP_FUZZ=false

# if [ "$DEEP_FUZZ" == "true" ]
# then 
#   export DAPP_TEST_FUZZ_RUNS=10000 # Fuzz for a long time if DEEP_FUZZ is set to true.
# else
#   export DAPP_TEST_FUZZ_RUNS=100 # Only fuzz briefly if DEEP_FUZZ is not set to true.
# fi

# # set so that we can deploy to local node w/o hosted private keys
export ETH_FROM=0x358606994a64e28B2C391b30ce1252E85d321A2F
export ETH_RPC_ACCOUNTS=true
export ETH_RPC_URL=http://127.0.0.1:8545
# # export ETH_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/o6UPhlAxnMIrCOpJrOFEcj_kFOciOJFY

# # tweaking hevm gas price, probably;
export ETH_GAS=0x1fffffffffffff
export ETH_GAS_PRICE=0
export DAPP_TEST_GAS_CALL=0x1fffffffffff


# dapp build --rpc
dapp test --rpc 
# dapp debug --rpc

