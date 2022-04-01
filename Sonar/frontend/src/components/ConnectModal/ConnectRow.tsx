import React from 'react';
import styled from 'styled-components';
import { Box } from '@material-ui/core';

import { Login, Config } from "./types";
import Web3 from 'web3';
import { connections, connectorLocalStorageKey } from "./entry";

declare let window: any;

interface Props {
    focus?: boolean;
    id: number;
    name: string;
    icon: any;
    setId: any;
    walletConfig: Config;
    login: Login;
    setOpen: () => void;
    account: any;
    setAccount: any;
}

const ConnectRow: React.FC<Props> = ({ login, walletConfig, focus, id, name, icon, setId, setOpen, account, setAccount }: any) => {
    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            window.ethereum.enable();
        }
    }

    const onConnectWallet = async () => {
        if(id === 0) {
            if (account) {
                return;
            }

            await loadWeb3();

            const accounts = await window.web3.eth.getAccounts();
            setAccount(accounts[0]);
            setOpen(false);
        }
        else {
            login(connections[id].connectorId);
            window.localStorage.setItem(connectorLocalStorageKey, connections[id].connectorId);
            setOpen(false)
        }
    }

    return (
        <StyledContainer width='calc(100% - 42px)' height='26px'
            bgcolor='rgb(239, 244, 245)'
            border='1px solid'
            borderColor={focus ? 'cardtxt.main' : 'transparent'}
            borderRadius='15px'
            display='flex' justifyContent='space-between' alignItems='center'
            padding='14.75px 20px'
            onClick={() => onConnectWallet()}
        >
            <Box display='flex' alignItems='center'>
                <Box color='rgb(58, 193, 97)' ml='15px' letterSpacing='1px'>{name}</Box>
            </Box>
            <Box width='40px' height='40px' borderRadius='50%' bgcolor='white' display='flex' justifyContent='center' alignItems='center'>
                <img src={icon} alt='connection-icon' />
            </Box>
        </StyledContainer>
    );
}

const StyledContainer = styled(Box)`
    cursor: pointer;
`;

const ConnectBall = styled(Box)`
    >div {
        transform: translate(-50%, -50%);
    }
`;

export default ConnectRow;