import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`

  :root {
    --primary-color: #34CB79;
    --title-color: #322153;
    --text-color: #6C6C80;
    --background-color: #FFF;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }
  body {
    background: #312E38;
    -webkit-font-smoothing: antialiased;
  }
  body, input, button {
    font-family: Roboto, Arial, Helvetica, sans-serif;
    font-size: 16px;
  }
  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 500;
    color: var(--title-color);
    font-family: Ubuntu;
  }
  button {
    cursor: pointer;
  }
`;