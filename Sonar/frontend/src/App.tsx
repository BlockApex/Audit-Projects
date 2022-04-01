import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from 'styled-components';
import Landing from './pages/Landing';
import ConnectModal from './components/ConnectModal';

import useAuth from './hooks/useAuth';

function App() {
  const [isOpen, setOpen] = useState(false);
  const { login, logout } = useAuth()
  const [account, setAccount] = useState();

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Landing isOpen={isOpen} setOpen={setOpen} account={account} setAccount={setAccount} />
          <Background />
          <Cyan />
          <ConnectModal login={login} open={isOpen} setOpen={setOpen} account={account} setAccount={setAccount} />
        </Route>
      </Switch>
    </Router>
  );
}

const Cyan = styled.div`
  z-index: -1;
  position: absolute;
  bottom: 0px; right: 5%;
  width: 30%; height: 20%;
  transform: translate(0px, 30%);
  border-radius: 50%;
  background-image: radial-gradient(rgba(0,200,255,.3), rgba(0,255,0,.1));
  filter: blur(100px);
`

const Background = styled.div`
  z-index: -2;
  position: absolute;
  width: 100%; height: 100%;
  background-image: conic-gradient(from 0.31turn , rgba(255,0,255,.05), #110e29 0.18turn, #110e29 0.6turn, rgba(255,0,255,.05) 0.8turn, rgba(255,0,255,.05));
  filter: blur(100px);
`

export default App;
