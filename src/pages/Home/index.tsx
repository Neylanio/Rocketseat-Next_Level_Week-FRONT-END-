import React from 'react';
import { FiLogIn } from 'react-icons/fi';

import { Container, Content, Main, Link, Background } from './styles';

import logo from '../../assets/logo.svg';

const Home: React.FC = () => {
    return (
        <Container>
            <Content>
                <header>
                    <img src={logo} alt="Ecoleta"/>
                </header>

                <Main>
                    <h1>Seu marketplace de coleta de resíduos.</h1>
                    <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>
                    <Link to="/create-point">
                        <span><FiLogIn /></span>
                        <strong>Cadastre um ponto de coleta</strong>
                    </Link>
                </Main>
            </Content>
            <Background />
        </Container>
    )
}

export default Home;