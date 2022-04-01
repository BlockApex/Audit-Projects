import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Box } from '@material-ui/core';

import axios from 'axios';

import imgEPING from '../../assets/images/eping.png'
import imgPING from '../../assets/images/ping.png'
import DoubleSide from '../../assets/images/doubleside.png'
import YouTube from '../../assets/images/youtube.png'

import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import BridgeEth from '../../build/contracts/BridgeEth.json';
import BridgeBsc from '../../build/contracts/BridgeBsc.json';
import TokenEth from '../../build/contracts/TokenEth.json';
import TokenBsc from '../../build/contracts/TokenBsc.json';

const decimalNumber = new BigNumber("1000000000000000000");
const bscNetworkId = 97;
const ethNetworkId = 3;
const feeAmount = 2;

// const adminAddress = "0xAC384287797DD6698461C6a178cAEfd723eaa645";
const apiEndpoint = 'http://13.58.253.172:3000';
// const apiEndpoint = 'http://localhost:5000';

const Landing = ({ isOpen, setOpen, account, setAccount }) => {

    const [isBSC, setIsBSC] = useState(true);
    const [balance, setBalance] = useState(0);
    const [amountValue, setAmountValue] = useState(0)
    const [addressValue, setAddressValue] = useState('0x...')
    const [processing, setProcessing] = useState(false);

    const onBridgeEth = async () => {
        const chainId = await window.web3.eth.getChainId();

        if (chainId !== 3) {
            alert ("Wrong Network");
            return;
        }

        setProcessing(true);
        const amount = new BigNumber(amountValue).multipliedBy(decimalNumber).toJSON();
        const amountToApprove = (new BigNumber(amountValue).plus(feeAmount)).multipliedBy(decimalNumber).toJSON();

        // const nonce = await window.web3.eth.getTransactionCount(adminAddress);
        const nonce = 1;

        const message = window.web3.utils.soliditySha3(
            { t: 'address', v: account },
            { t: 'address', v: addressValue },
            { t: 'uint256', v: amount },
            { t: 'uint256', v: nonce },
        ).toString('hex');

        const signature = await window.web3.eth.personal.sign(
            message,
            account
        );

        const bridgeEthAddress = BridgeEth.networks[ethNetworkId].address;
        const tokenEthInstance = await new window.web3.eth.Contract(TokenEth.abi, TokenEth.networks[ethNetworkId].address);
        const bridgeEthInstance = await new window.web3.eth.Contract(BridgeEth.abi, bridgeEthAddress);
        await tokenEthInstance.methods.approve(bridgeEthAddress, amountToApprove).send({ from: account });
        await bridgeEthInstance.methods.burn(account, amount, nonce, signature).send({ from: account });

        await axios.post(`${apiEndpoint}/ethbridge`, {
            from: account,
            to: addressValue,
            amount,
            nonce,
            signature
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        setProcessing(false);
        alert("Transaction has been processed successfully");
    }

    const onBridgeBsc = async () => {

        const chainId = await window.web3.eth.getChainId();

        if (chainId !== 97) {
            alert ("Wrong Network");
            return;
        }

        setProcessing(true);
        const amount = new BigNumber(amountValue).multipliedBy(decimalNumber).toJSON();
        const amountToApprove = (new BigNumber(amountValue).plus(feeAmount)).multipliedBy(decimalNumber).toJSON();

        // const nonce = await window.web3.eth.getTransactionCount(adminAddress);
        const nonce = 1;

        const message = window.web3.utils.soliditySha3(
            { t: 'address', v: account },
            { t: 'address', v: addressValue },
            { t: 'uint256', v: amount },
            { t: 'uint256', v: nonce },
        ).toString('hex');

        const signature = await window.web3.eth.personal.sign(
            message,
            account
        );

        const bridgeBscAddress = BridgeBsc.networks[bscNetworkId].address;
        const tokenBscInstance = await new window.web3.eth.Contract(TokenBsc.abi, TokenBsc.networks[bscNetworkId].address);
        const bridgeBscInstance = await new window.web3.eth.Contract(BridgeBsc.abi, bridgeBscAddress);
        await tokenBscInstance.methods.approve(bridgeBscAddress, amountToApprove).send({ from: account });
        await bridgeBscInstance.methods.burn(account, amount, nonce, signature).send({ from: account });

        await axios.post(`${apiEndpoint}/bscbridge`, {
            from: account,
            to: addressValue,
            amount,
            nonce,
            signature
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        setProcessing(false);
        alert("Transaction has been processed successfully");
    }

    const fetchBalance = async () => {
        let value;
        if (isBSC) {
            const tokenBscInstance = await new window.web3.eth.Contract(TokenBsc.abi, TokenBsc.networks[bscNetworkId].address);
            value = await tokenBscInstance.methods.balanceOf(account).call();
        } else {
            const tokenEthInstance = await new window.web3.eth.Contract(TokenEth.abi, TokenEth.networks[ethNetworkId].address);
            value = await tokenEthInstance.methods.balanceOf(account).call();
        }
        setBalance(new BigNumber(value).dividedBy(decimalNumber).decimalPlaces(2).toJSON());
    }
    const handleChangeAmount = (e) => {
        setAmountValue(e.target.value)
    }
    const handleAddressInput = (e) => {
        setAddressValue(e.target.value)
    }

    useEffect(() => {
        if (account) {
            fetchBalance();
            setAddressValue(account ? account : "0x...")
        }
    }, [account, isBSC]);

    return (
        <StyledContainer display='flex' flexDirection='column' alignItems='center' justifyContent='center' position='relative'>
            <Box fontFamily='SFProDisplaySemibold' fontSize='34px' color='white' margin='0 18px 10px 15px'>Network Bridge</Box>
            <Box fontSize='17px' color='#bbbbd3'>Bridging the gap for all $PING holders</Box>
            <Box mt='46px' width='352px' position='relative'>
                <Background />
                <Card1 padding='20px 30px 14px 22px' borderRadius='20px'
                    display='flex' justifyContent='space-between'
                    bgcolor='white' width='300px'
                    position='relative'
                >
                    <SwithIcon position='absolute' bottom='-30px' right='-72.8px'>
                        <SwitchButton width='57px' height='58px' bgcolor='rgba(255, 255, 255, 0.05)' boxShadow='0 12px 18px 0 rgba(0, 0, 0, 0.23)' borderRadius='50%' position='relative'
                        onClick={() => setIsBSC(!isBSC)}
                        >
                            <img width='65%' src={DoubleSide} alt='' />
                            <Box fontSize='14.8px' letterSpacing='0.5px' position='absolute' bottom='-40px' left='50%' color='rgba(187,187,211,.4)'>Switch</Box>
                        </SwitchButton>
                    </SwithIcon>
                    <Box flex='1.8'>
                        <Box fontFamily='SFProTextRegular' color='#17192c' fontSize='15px'>
                            You wrap
                        </Box>
                        <Box fontFamily='SFProDisplayMedium' color='#14192e' fontSize='34px' fontWeight='500'>
                            <AmountInput component='input' type='number'
                                value={amountValue === 0 ? '' : amountValue} onChange={handleChangeAmount}
                                maxWidth={amountValue.length === 0 ? 'unset' : amountValue.length * 20}
                            />
                        </Box>
                        <ThirdLabel fontFamily='SFProTextRegular' color='#18192a' fontSize='14px' mt='8px' letterSpacing='-0.58px'>
                            <Box component='span'>Balance:</Box>
                            <Box component='span' ml='8px'>{balance}</Box>
                        </ThirdLabel>
                    </Box>
                    <Box flex='1' display='flex' justifyContent='space-between' alignItems='center'>
                        <Box display='flex' flexDirection='column' alignItems='center'>
                            <Box color='#20182b' fontSize='22px' letterSpacing='-0.52px' mb='1.5px'>{isBSC ? 'Ping' : 'ePing'}</Box>
                            <CardBadge><Box>{isBSC ? 'BSC' : 'ETH'}</Box></CardBadge>
                        </Box>
                        <Box>
                            <img width='40px' src={isBSC ? imgPING : imgEPING} alt='' />
                        </Box>
                    </Box>
                </Card1>
                <ReceiveContainer mt='11px' position='relative' width='100%'>
                    <ReceiveBorder position='absolute' left='0' top='39px'
                        width='-webkit-fill-available' height='calc(100% - 39px)'
                        bgcolor='transparent'
                    />
                    <Card1 padding='20px 30px 14px 22px' borderRadius='20px'
                        display='flex' justifyContent='space-between'
                        bgcolor='white' width='300px'
                    >
                        <Box flex='1.8'>
                            <Box fontFamily='SFProTextRegular' color='#17192c' fontSize='15px'>You receive</Box>
                            <Box fontFamily='SFProDisplayMedium' color='#14192e' fontSize='34px' fontWeight='500' maxWidth='130px' overflow='hidden'>
                                <Box component='span' width='60px'>{amountValue.length === 0 ? 0 : amountValue}</Box>
                            </Box>
                            <ThirdLabel color='#18192a' fontFamily='SFProTextRegular' fontSize='14px' mt='8px'
                                display='flex' alignItems='center' letterSpacing='-0.58px'
                            >
                                <svg viewBox="0 0 24 24" width='15px' height='15px' fill='rgba(20,25,46,.5)'>
                                    <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 13.5V19H6v-7h6v1.5zm0-3.5H6V5h6v5zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"></path>
                                </svg>
                                <Box component='span' ml='8px' >Gas Fees:</Box>
                                <Box component='span' ml='3px' fontWeight='bold'>46</Box>
                                <Box component='span' ml='2px'>GWEI</Box>
                            </ThirdLabel>
                        </Box>
                        <Box flex='1' display='flex' justifyContent='space-between' alignItems='center'>
                            <Box display='flex' flexDirection='column' alignItems='center'>
                                <Box color='#20182b' fontSize='22px' letterSpacing='-0.52px' mb='1.5px'>{isBSC ? 'ePing' : 'Ping'}</Box>
                                <CardBadge><Box>{isBSC ? 'ETH' : 'BSC'}</Box></CardBadge>
                            </Box>
                            <Box>
                                <img width='40px' src={isBSC ? imgEPING : imgPING} alt='' />
                            </Box>
                        </Box>
                    </Card1>
                    <Box padding='14px 19px'>
                        <Box fontFamily='SFProTextRegular' color='rgba(187,187,211,.4)' fontSize='15px' letterSpacing='-0.63px'>Receiving address</Box>
                        <AddressInput>
                            <Template>{addressValue}</Template>
                            <input type="text"
                                value={addressValue} onChange={handleAddressInput}
                            />
                        </AddressInput>
                        <Box display='flex' mt='19px' alignItems='center'>
                            <svg viewBox="0 0 24 24" width='15px' height='15px' fill='rgba(187,187,211,.4)'>
                                <path d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
                            </svg>
                            <Box ml='8px' color='rgba(187,187,211,.4)' letterSpacing='-0.63px' fontSize='15px' fontFamily='SFProTextRegular'>Make sure the address is on</Box>
                            <Box ml='6px' width='67px' height='19px' letterSpacing='0.5px' fontSize='13px'
                                display='flex' justifyContent='center' alignItems='center'
                                bgcolor='rgb(255,255,255, .1)' color='white' borderRadius='9.5px'
                            >
                                {isBSC ? 'ERC-20' : 'BEP-20'}
                            </Box>
                        </Box>
                    </Box>
                </ReceiveContainer>
                <RainbowBox mt='16px' width='calc(100% - 6px)' padding='3px'>
                    {account && (
                        <Box bgcolor='#110e29' width='100%' height='100%' borderRadius='9px'
                            display='flex' justifyContent='center' alignItems='center'
                            style={{ cursor: 'pointer' }} onClick={() => {
                                if (processing) {
                                    return;
                                }
                                if (isBSC) {
                                    onBridgeBsc();
                                } else {
                                    onBridgeEth();
                                }
                            }}
                        >
                            {processing ? (
                                <Box color='white' fontSize='16.8px' fontWeight='500' >Processing...</Box>
                            ) : (
                                <Box color='white' fontSize='16.8px' fontWeight='500' >Wrap {isBSC ? 'PING' : 'ePING'} into {isBSC ? 'ePING' : 'PING'}</Box>
                            )}
                        </Box>
                    )}
                    {!account && (
                        <Box bgcolor='#110e29' width='100%' height='100%' borderRadius='9px'
                            display='flex' justifyContent='center' alignItems='center'
                            style={{ cursor: 'pointer' }}
                            onClick={() => setOpen(!isOpen)}
                        >
                            <Box color='white' fontSize='16.8px' fontWeight='500' >Connect Wallet</Box>
                        </Box>
                    )}
                </RainbowBox>
                <Help mt='16px' display='flex' >
                    <Box width='80px' display='flex' flexDirection='column' justifyContent='space-between' alignItems='center' pt='10.5px' pb='10.5px'>
                        <img src={YouTube} width='26px' height='auto' alt='' />
                        <Box color='rgba(187, 187, 211, .7)' letterSpacing='-0.62px' fontSize='14.8px'>How to</Box>
                    </Box>
                    <Box ml='12px' flex='1' padding='11px 36px 14px 16px' display='flex' alignItems='flex-start'>
                        <Box>
                            <svg viewBox='0 0 21 21' fill='#bbbbd3' width='21px' height='21px'>
                                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM9 14H11V16H9V14ZM10.61 4.04C8.55 3.74 6.73 5.01 6.18 6.83C6 7.41 6.44 8 7.05 8H7.25C7.66 8 7.99 7.71 8.13 7.33C8.45 6.44 9.4 5.83 10.43 6.05C11.38 6.25 12.08 7.18 12 8.15C11.9 9.49 10.38 9.78 9.55 11.03C9.55 11.04 9.54 11.04 9.54 11.05C9.53 11.07 9.52 11.08 9.51 11.1C9.42 11.25 9.33 11.42 9.26 11.6C9.25 11.63 9.23 11.65 9.22 11.68C9.21 11.7 9.21 11.72 9.2 11.75C9.08 12.09 9 12.5 9 13H11C11 12.58 11.11 12.23 11.28 11.93C11.3 11.9 11.31 11.87 11.33 11.84C11.41 11.7 11.51 11.57 11.61 11.45C11.62 11.44 11.63 11.42 11.64 11.41C11.74 11.29 11.85 11.18 11.97 11.07C12.93 10.16 14.23 9.42 13.96 7.51C13.72 5.77 12.35 4.3 10.61 4.04Z" />
                            </svg>
                        </Box>
                        <Box ml='8px'>
                            <Box color='#cecee7' fontSize='16.8px' fontWeight='500' letterSpacing='-0.7px'
                                style={{ cursor: 'pointer' }}
                                onClick={() => window.open('https://academy.binance.com/en/articles/what-are-wrapped-tokens', '_blank')}
                            >
                                What's a wrapped token?
                            </Box>
                            <Box color='rgba(187, 187, 211, .5)' fontSize='14.8px' letterSpacing='-0.62px'>Learn on Binance Academy</Box>
                        </Box>
                    </Box>
                </Help>
            </Box >
        </StyledContainer >
    );
}

const Background = styled.div`
    position: absolute;
    left: 0px; top:60px;
    width: 90%;
    height: 150px;
    transform: translate(5%,0px) rotate(180deg);
    filter: blur(70px);
    background-image: conic-gradient(from 0.31turn, #5a47d3, #35df4b 0.18turn, #ffb200 0.47turn, #ef18ae 0.67turn, #5a47d3);
    border-image-slice: 1;
    border-radius: 20px;
`

const SwitchButton = styled(Box)`
    cursor: pointer;
    transition: .3s;
    &:hover {
        opacity: 0.6;
    }
`

const AddressInput = styled.label`
    display: inline-block;
    position: relative;
    min-width: 2em;
    min-height: 1.4em;
    max-width: 100%;
    >input {
        color: white;
        padding: 0;
        margin: 0;
        border: none;
        outline: none;
        border-bottom: 1px solid white;
        /* added styles */
        font-family: inherit;
        font-size: 20px;
        position: absolute;
        vertical-align: top;
        top: 0;
        left: 0;
        width: 100%;
        background: transparent;
    }
`

const Template = styled.span`
    white-space: pre;
    color: transparent;
    font-size: 20px;
`

const AmountInput = styled(Box)`
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    width: 130px;
    font-family: SFProDisplayRegular;
    font-weight: 500;
    font-size: 34px;
    color: #14192e;
    outline: none;
    border: none;
    border-bottom: 1px solid #14192e;
`

const SwithIcon = styled(Box)`
    >div >div {
        transform: translate(-50%, 0px);
    }
    >div >img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
`

const Help = styled(Box)`
    >div {
        border-radius: 17.7px;
        background: rgb(40,42,56);
        // background-image: linear-gradient(75deg, #fff 9%, #d8d8d8 97%);
    }
`

const RainbowBox = styled(Box)`
    height: 52px;
    margin: 16px 14.8px 16px 2px;
    border-radius: 12px;
    background-image: conic-gradient(from 0.31turn, #5a47d3, #35df4b 0.18turn, #ffb200 0.47turn, #ef18ae 0.67turn, #5a47d3);
    border-image-slice: 1;
    box-shadow: 0px 0px 17px -5px grey;
    >div {
        box-shadow: 0px 0px 17px -5px grey;
    }
`

const ReceiveBorder = styled(Box)`
    z-index: -1;
    border-radius: 17.7px;
    border-style: solid;
    border-width: 3.5px outset;
    border-color: rgb(52,52,67);
    border-image-slice: 1;
`

const ReceiveContainer = styled(Box)`
`

const ThirdLabel = styled(Box)`
    opacity: .5;
`

const CardBadge = styled(Box)`
    color: #20182b;
    width: 40px;
    height: 19px;
    letter-spacing: 0.5px;
    font-size: 13px;
    font-weight: 500;
    border-radius: 9.5px;
    background: rgba(60, 72, 83, .2);
    position:relative;
    >div {
        position: absolute;
        top:50%;
        left:50%;
        transform: translate(-50%, -50%);
    }
`

const Card1 = styled(Box)`
`

const StyledContainer = styled(Box)`
`

export default Landing;