import React from 'react';
import { Link } from 'react-router-dom';
import './listaentregador.css';

function ListaEntregador(props) {

    return <table className="table table-hover table-bordered">
        <thead>
            <tr className="table-secondary">
                <th scope="col">Código</th>
                <th scope="col">Nome</th>
                <th scope="col">Telefone</th>
                <th scope="col">Valor</th>
                <th scope="col" className="col-acao"></th>
            </tr>
        </thead>
        <tbody>

            {
                props.arrayEntregadores.map((entregador) => {
                    return <tr key={entregador.id}>
                        <th scope="row">{entregador.codigo}</th>
                        <td>{entregador.nome}</td>
                        <td>{entregador.fone}</td>
                        <td>{entregador.preco}</td>
                        <td>
                            <Link to={'/app/editarentregador/' + entregador.id}><i className="fas fa-edit icone-acao"></i></Link>
                            <Link to='#' onClick={() => props.clickDelete(entregador.id)}><i className="far fa-trash-alt icone-acao red"></i></Link>
                        </td>
                    </tr>
                })
            }


        </tbody>
    </table>
}

export default ListaEntregador;