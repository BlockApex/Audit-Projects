import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal, Box } from '@material-ui/core';

import ConnectRow from './ConnectRow';
import { Login } from "./types";
import { connections, connectorLocalStorageKey } from "./entry";

interface Props {
    open: any;
    setOpen: any;
    login: Login;
    account: any;
    setAccount: any;
}

const ConnectModal: React.FC<Props> = ({ open, setOpen, login, account, setAccount }: any) => {
    const [id, setId] = useState(-1);
    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <Container bgcolor='white' fontFamily='Poppins' color='white'>
                <Wrapper display='flex' flexDirection='column' justifyContent='center' alignItems='center' bgcolor='topbarbg.main'>
                    <Box color='rgb(69, 42, 165)' fontSize='18px' fontWeight='700' lineHeight='120%' width='100%'
                        display='flex' justifyContent='space-between'
                    >
                        <Box ml='7px' letterSpacing='1px'>Connect to Wallet</Box>
                        <Box onClick={() => setOpen(false)} style={{cursor:'pointer'}}>
                            <svg viewBox="0 0 24 24" aria-hidden="true" width='24px' height='24px' fill='rgb(58, 193, 97)'>
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path>
                            </svg>
                        </Box>
                    </Box>
                    <Box mt='30px' width='359px' display='flex' flexDirection='column'>
                        {connections.map((each:any, i:number) => 
                            <ConnectRow
                                key={i}
                                login={login}
                                walletConfig={each}
                                id={each.id}
                                focus={id===each.id}
                                name={each.name}
                                icon={each.icon}
                                setId={setId}
                                setOpen={setOpen}
                                account={account}
                                setAccount={setAccount}
                            />
                        )}
                    </Box>
                </Wrapper>
            </Container>
        </Modal>
    );
}

const Container = styled(Box)`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 16px;
    background: transparent;
`;


const Wrapper = styled(Box)`
    border-radius: 16px;
    padding: 40px 26px 40px 25px;
    >div:nth-of-type(2) {
        >div+div {
            margin-top: 10px;
        }
    }
    >div:last-of-type >button{
        width: 100%;
        height: 44px;
    }
`;

export default ConnectModal;