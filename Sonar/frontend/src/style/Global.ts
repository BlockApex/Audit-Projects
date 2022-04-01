import { createGlobalStyle } from 'styled-components';
import SFProDisplaySemibold from '../assets/fonts/SFProDisplay-Semibold.ttf'
import SFProDisplayMedium from '../assets/fonts/SFProDisplay-Medium.ttf'
import SFProDisplayRegular from '../assets/fonts/SFProDisplay-Regular.ttf'
import SFProTextRegular from '../assets/fonts/SFProText-Regular.ttf'

//17 18 20

const GlobalStyle = createGlobalStyle`
    @font-face {
        font-family: 'SFProDisplaySemibold';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('${SFProDisplaySemibold}') format('truetype');
    }
    @font-face {
        font-family: 'SFProDisplayMedium';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('${SFProDisplayMedium}') format('truetype');
    }
    @font-face {
        font-family: 'SFProDisplayRegular';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('${SFProDisplayRegular}') format('truetype');
    }
    @font-face {
        font-family: 'SFProTextRegular';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('${SFProTextRegular}') format('truetype');
    }
    html, body {
        height: 100%;
    }
    body {
        background-color: #110e29;
    }
    * {
        font-family: SFProDisplayRegular;
    }
    #root {
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

export default GlobalStyle;