import styled from 'styled-components';
import { Link as LinkReact } from 'react-router-dom';
import backgroundImg from '../../assets/home-background.svg';


export const Container = styled.div`
  height: 100vh;
  width: 100vw;

  display: flex;
  align-items: stretch;

`;

export const Content = styled.section`
  width: 100%;
  height: 100%;
  max-width: 580px;
  margin: 0 auto;
  padding: 0 30px;

  display: flex;
  flex-direction: column;
  align-items: center;

  header {
    width: 100%;
    height: 150px;
    img {
      margin: 48px 0 0;
    }
  }

  @media(max-width: 700px) {
    
    text-align: center;

    header {
      img {
        margin: 64px auto;
      }
    }

  }

`;


export const Main = styled.main`
  flex: 1;
  max-width: 560px;

  display: flex;
  flex-direction: column;
  justify-content: center;


  h1 {
    font-size: 54px;
    color: var(--primary-color);
  }

  p {
    font-size: 24px;
    margin-top: 24px;
    line-height: 38px;
    color: var(--text-color);
  }

  @media(max-width: 700px) {
    align-items: center;

    h1 {
      font-size: 42px;
    }

    p {
      font-size: 20px;
    }
  }
`;

export const Link = styled(LinkReact)`
  width: 100%;
  max-width: 360px;
  height: 72px;
  background: var(--primary-color);
  border-radius: 8px;
  text-decoration: none;

  display: flex;
  align-items: center;
  overflow: hidden;

  margin-top: 40px;

  span {
    display: block;
    background: rgba(0, 0, 0, 0.08);
    width: 72px;
    height: 72px;

    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;

    svg {
      color: #FFF;
      width: 20px;
      height: 20px;
    }
  }

  strong {
    flex: 1;
    text-align: center;
    color: #FFF;
  }

  &:hover {
    background: #2FB86E;
  }

`;

export const Background = styled.section`
  height: 100vh;
  flex: 1;
  background: url(${backgroundImg}) no-repeat 0 50px;
  background-size: cover;
`;