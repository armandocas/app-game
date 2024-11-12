import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
// import Navbar from '../Components/Navbar/navbar';
import './novovisitante.css';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import firebaseApp from '../Config/firebase';
import axios from 'axios';

function NovoVisitante() {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setRua] = useState('');
  const [bairro, setBairro] = useState('');
  const [numero, setNumero] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [complemento, setComplemento] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState('N');

  const db = getFirestore(firebaseApp);

  function buscarCep() {
    axios.get(`https://viacep.com.br/ws/${cep}/json/`)
      .then(response => {
        const { logradouro, bairro, localidade, uf, complemento } = response.data;
        setRua(logradouro);
        setBairro(bairro);
        setCidade(localidade);
        setComplemento(complemento || '');
        setUf(uf);
      })
      .catch(() => {
        setMensagem('CEP não encontrado.');
      });
  }

  async function cadastrarVisitante() {
    if (cep.length === 0) {
      setMensagem('Informe o CEP');
    } else {
      const visitorData = {
        fullName: nomeCompleto,
        phoneWhatsApp: telefone,
        postalCode: cep,
        street: logradouro,
        district: bairro,
        num: numero,
        city: cidade,
        complement: complemento,
        uf: uf
      };

      // Log dos dados que você está tentando enviar
      console.log("Dados do visitante:", visitorData);

      try {
        await addDoc(collection(db, "visitors"), visitorData);
        setMensagem('');
        setSucesso('S');
      } catch (erro) {
        setMensagem(`Erro ao cadastrar visitante: ${erro.message}`);
        setSucesso('N');
      }
    }
  }

  return (
    <div>
      {/* <Navbar /> */}
      <div className="container-fluid titulo">
        <div className="offset-lg-3 col-lg-6">
          <h1>Cadastrar Novo Visitante</h1>
          <form>
            <div className="mb-3">
              <label htmlFor="InputNome" className="form-label">Nome Completo</label>
              <input onChange={(e) => setNomeCompleto(e.target.value)} type="text" className="form-control" id="InputNome" />
            </div>
            <div className="mb-3">
              <label htmlFor="InputTelefone" className="form-label">Telefone/WhatsApp</label>
              <input onChange={(e) => setTelefone(e.target.value)} type="text" className="form-control" id="InputTelefone" />
            </div>
            <div className="mb-3">
              <label htmlFor="InputCEP" className="form-label">CEP</label>
              <input onBlur={buscarCep} onChange={(e) => setCep(e.target.value)} type="text" className="form-control" id="InputCEP" />
            </div>
            <div className="mb-3">
              <label htmlFor="InputRua" className="form-label">Rua</label>
              <input value={logradouro} onChange={(e) => setRua(e.target.value)} type="text" className="form-control" id="InputRua" />
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
              <button onClick={cadastrarVisitante} type="button" className="btn btn-primary btn-acao">Salvar</button>
            </div>
            {mensagem.length > 0 ? <div className="alert alert-danger mt-2" role="alert">{mensagem}</div> : null}
            {sucesso === 'S' ? <Navigate to='/app/home' /> : null}
          </form>
        </div>
      </div>
    </div>
  );
}

export default NovoVisitante;
