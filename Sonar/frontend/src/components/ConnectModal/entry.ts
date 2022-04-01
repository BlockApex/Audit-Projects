import Icon1 from '../../assets/images/connect/1.svg'
import Icon2 from '../../assets/images/connect/2.svg'
import Icon3 from '../../assets/images/connect/3.svg'

import { Config, ConnectorNames } from "./types";

export const connections: Config[] = [
    {
        id: 0,
        name: 'Metamask',
        icon: Icon1,
        connectorId: ConnectorNames.Injected,
    },
    {
        id: 1,
        name: 'Wallet Connect',
        icon: Icon2,
        connectorId: ConnectorNames.WalletConnect,
    },
    {
        id: 2,
        name: "Binance Chain Wallet",
        icon: Icon3,
        connectorId: ConnectorNames.BSC,
    },
];

export const connectorLocalStorageKey = "connectorId";