import { SVGAttributes } from "react";
import { DefaultTheme } from "styled-components";

export enum ConnectorNames {
  Injected = "injected",
  WalletConnect = "walletconnect",
  BSC = "bsc",
}

export type Login = (connectorId: ConnectorNames) => void;

export interface Config {
  id: number;
  name: string;
  icon: any;
  connectorId: ConnectorNames;
}
