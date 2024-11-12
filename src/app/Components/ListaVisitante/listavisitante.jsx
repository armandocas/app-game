import React from 'react';
import { Link } from 'react-router-dom';
import './listavisitante.css';

function ListaVisitantes(props) {

    return <table className="table table-hover table-bordered">
        <thead>
            <tr className="table-secondary">
                <th scope="col">Nome</th>
                <th scope="col">Endereço</th>
                <th scope="col">Telefone</th>
                <th scope="col" className="col-acao"></th>
            </tr>
        </thead>
        <tbody>
            {
                props.arrayVisitantes.map((visitantes, index) => {
                    return <tr key={index}>
                        <td>{visitantes.nome}</td>
                        <td>{visitantes.rua}, {visitantes.bairro}, {visitantes.numero},</td>
                        <td>{visitantes.fone}</td>
                        <td>
                            <Link to={'/app/editarvisitante/' + visitantes.id}><i className="fas fa-edit icone-acao"></i></Link>
                            <Link to='#' onClick={() => props.clickDelete(visitantes.id)}><i className="far fa-trash-alt icone-acao red"></i></Link>
                        </td>
                    </tr>
                })
            }


        </tbody>
    </table>
}

export default ListaVisitantes;