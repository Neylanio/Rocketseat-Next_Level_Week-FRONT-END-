import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { FiArrowLeft } from 'react-icons/fi';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';
import axios from 'axios';

import Dropzone from '../../components/Dropzone/index';

import logo from '../../assets/logo.svg';

import { Container, Header, Form } from './styles';

//Always that i put Array or Object i need to show the variable type

interface Item{
    id: number;
    title: string;
    image_url: string;
}

interface IBGEUFResponse{
    sigla: string;
}

interface IBGECITYResponse{
    nome: string;
}

const CreatePoint: React.FC = () => {

    const [ items, setItems ] = useState<Item[]>([]);
    const [ ufs, setUfs ] = useState<string[]>([]);
    const [ cities, setCities ] = useState<string[]>([]);

    const [ initialPosition, setinitialPosition ] = useState<[number, number]>([0,0]);

    const [ formData, setFormdata ] = useState({
        name: '',
        email: '',
        whatsapp: '',
    });

    const [ selectedItems, setSelectedItems ] = useState<number[]>([]);

    const [ selectedUf, setSelectedUf ] = useState('0');
    const [ selectedCity, setSelectedCity ] = useState('0');
    const [ selectedPosition, setSelectedPosition ] = useState<[number, number]>([0,0]);
    const [ selectedFile, setSelectedFile ] = useState<File>()

    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;

            setinitialPosition([latitude, longitude]);
            console.log(initialPosition);
        });
    }, [initialPosition]);

    //to get items from Back-end
    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        });
    }, []);


    // below, to get IBGE datas

    //getUFs
    useEffect(() => {
        axios.get<IBGEUFResponse[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome").then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);

            setUfs(ufInitials);
        });
    }, []);

    //getCities
    useEffect(() => {

        if(selectedUf === '0') return;

        axios.get<IBGECITYResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`).then(response => {
            const cityNames = response.data.map(city => city.nome);

            setCities(cityNames);
        });

    }, [selectedUf]);

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedUf(event.target.value);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedCity(event.target.value);
    }

    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat, 
            event.latlng.lng,
        ]);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target;

        setFormdata({ ...formData, [name]: value });
    }

    function handleSelectedItem(id: number){
        
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if(alreadySelected >= 0){//It's Exists
            const filteredItems = selectedItems.filter(item => item !== id);

            setSelectedItems(filteredItems);
        }else{//It isn't Exists
            setSelectedItems([ ...selectedItems, id ]);
        }

    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [ latitude, longitude ] = selectedPosition;
        const items = selectedItems;

        const data = new FormData();

        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('uf', uf);
        data.append('city', city);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', items.join(','));
        
        if(selectedFile){
            data.append('image', selectedFile);
        } 

        try{
            await api.post("points", data);
            alert('Ponto de coleta criado!!')
            // window.open(pagina, '', ',type=fullWindow,fullscreen,scrollbars=yes, menubar=no');
            // setTimeout(function(){ 
                history.push('/');                
            // }, 2000);
        }catch(e){
            alert('Digite todos os campos obrigatórios');
        }
    }

    return(
        <Container>
            <Header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    <FiArrowLeft /> 
                    Voltar p/ Home
                </Link>
            </Header>
            <Form onSubmit={handleSubmit}>

                <h1>Cadastro do <br /> ponto de coleta</h1>

                <p id="info">Campos Obrigatórios *</p>
                
                <Dropzone 
                    onFileUploaded={setSelectedFile}
                />
                <p id="obrigatoryImage"> OBS: Imagem obrigatória </p>

                <fieldset>
                    <legend>
                        <h2>Dados *</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome *</label>
                        <input type="text" name="name" id="name" onChange={handleInputChange}/>
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail *</label>
                            <input type="email" name="email" id="email" onChange={handleInputChange}/>
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp *</label>
                            <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange}/>
                        </div>

                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço *</h2>
                        <span>OBS: Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick} style={{ height: 300, marginBottom: 64 }} >
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF) *</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                            <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade *</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta *</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id} onClick={() => handleSelectedItem(item.id)} className={selectedItems.includes(item.id) ? 'selected' : ''}>
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </Form>
        </Container> 
    );
}

export default CreatePoint;