import React, { useState, useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Navbar from '../Components/Navbar/navbar';
import './editarvisitante.css';

// Importando métodos específicos do Firebase v9
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import firebaseApp from '../../Config/firebase';
import axios from 'axios';

function EditarVisitante() {
  const { id } = useParams(); // Utilizando o hook useParams para obter o ID do visitante

  const [nomeCompleto, setNomeCompleto] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [numero, setNumero] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [complemento, setComplemento] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState('N');

  // Obtendo a instância do Firestore
  const db = getFirestore(firebaseApp);

  function buscarCep() {
    if (cep.length !== 8) {
      setMensagem('CEP inválido.');
      return;
    }

    axios.get(`https://viacep.com.br/ws/${cep}/json/`)
      .then(response => {
        if (response.data.erro) {
          setMensagem('CEP não encontrado.');
          return;
        }

        const { logradouro, bairro, localidade, uf, complemento } = response.data;
        setLogradouro(logradouro);
        setBairro(bairro);
        setCidade(localidade);
        setUf(uf);
        setComplemento(complemento || '');
      })
      .catch(() => {
        setMensagem('Erro ao buscar o CEP.');
      });
  }

  useEffect(() => {
    const visitanteRef = doc(db, 'visitors', id);
    getDoc(visitanteRef)
      .then((resultado) => {
        if (resultado.exists()) {
          const data = resultado.data();
          setNomeCompleto(data.fullName);
          setLogradouro(data.street);
          setNumero(data.num);
          setBairro(data.district);
          setTelefone(data.phoneWhatsApp);
          setCidade(data.city);
          setUf(data.uf);
          setComplemento(data.complement);
          setCep(data.postalCode);
        } else {
          setMensagem('Erro: Documento não encontrado.');
        }
      })
      .catch((erro) => {
        setMensagem('Erro ao buscar dados: ' + erro.message);
      });
  }, [db, id]);

  function AlterarVisitante() {
    if (!nomeCompleto) {
      setMensagem('Informe o nome completo.');
    } else if (!logradouro) {
      setMensagem('Informe a rua.');
    } else {
      const visitanteRef = doc(db, 'visitors', id);
      updateDoc(visitanteRef, {
        fullName: nomeCompleto,
        street: logradouro,
        num: numero,
        district: bairro,
        phoneWhatsApp: telefone,
        complement: complemento,
        postalCode: cep,
        uf: uf,
        city: cidade,
      })
        .then(() => {
          setMensagem('');
          setSucesso('S');
        })
        .catch((erro) => {
          setMensagem(`Erro ao atualizar: ${erro.message}`);
          setSucesso('N');
        });
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container-fluid titulo">
        <div className="offset-lg-3 col-lg-6">
          <h1>Editar Visitante</h1>
          <form>
            <div className="mb-3">
              <label htmlFor="InputNome" className="form-label">Nome Completo</label>
              <input type='text' value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} className='form-control' id='InputNome' aria-describedby='nomeHelp'/>
            </div>
            <div className="mb-3">
              <label htmlFor="InputTelefone" className="form-label">Telefone/WhatsApp</label>
              <input onChange={(e) => setTelefone(e.target.value)} type="text" value={telefone} className="form-control" id="InputTelefone" />
            </div>
            <div className="mb-3">
              <label htmlFor="InputCEP" className="form-label">CEP</label>
              <input onBlur={buscarCep} onChange={(e) => setCep(e.target.value)} type="text" value={cep} className="form-control" id="InputCEP" />
            </div>
            <div className="mb-3">
              <label htmlFor="InputRua" className="form-label">Rua</label>
              <input value={logradouro} onChange={(e) => setLogradouro(e.target.value)} type="text" className="form-control" id="InputRua" />
            </div>
            <div className="mb-3">
              <label htmlFor="InputNumero" className="form-label">Número</label>
              <input value={numero} onChange={(e) => setNumero(e.target.value)} type="number" className="form-control" id="InputNumero" />
            </div>
            <div className="mb-3">
              <label htmlFor="InputComplemento" className="form-label">Complemento</label>
              <input value={complemento} onChange={(e) => setComplemento(e.target.value)} type="text" className="form-control" id="InputComplemento" />
            </div>
            <div className="mb-3">
              <label htmlFor="InputBairro" className="form-label">Bairro</label>
              <input value={bairro} onChange={(e) => setBairro(e.target.value)} type="text" className="form-control" id="InputBairro" />
            </div>
            <div className="mb-3">
              <label htmlFor="InputCidade" className="form-label">Cidade</label>
              <input value={cidade} onChange={(e) => setCidade(e.target.value)} type="text" className="form-control" id="InputCidade" />
            </div>
            <div className="mb-3">
              <label htmlFor="InputUf" className="form-label">UF</label>
              <input value={uf} onChange={(e) => setUf(e.target.value)} type="text" className="form-control" id="InputUf" />
            </div>
            
            <div className="text-center">
              <Link to="/app/home" className="btn btn-outline-primary btn-acao">Cancelar</Link>
              <button onClick={AlterarVisitante} type="button" className="btn btn-primary btn-acao">Salvar</button>
            </div>
            {mensagem.length > 0 && <div className="alert alert-danger mt-2" role="alert">{mensagem}</div>}
            {sucesso === 'S' && <Navigate to='/app/home' replace />}
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarVisitante;
