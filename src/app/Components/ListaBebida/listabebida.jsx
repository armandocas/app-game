import React from 'react';
import { Link } from 'react-router-dom';
import './listabebida.css';

function ListaBebida(props) {

    return <table className="table table-hover table-bordered">
        <thead>
            <tr className="table-secondary">
                <th scope="col">Código</th>
                <th scope="col">Nome</th>
                <th scope="col">Quantidade ML - L</th>
                <th scope="col">Valor</th>
                <th scope="col">Estoque</th>
                <th scope="col" className="col-acao"></th>
            </tr>
        </thead>
        <tbody>

            {
                props.arrayBebidas.map((bebida) => {
                    return <tr key={bebida.id}>
                        <th scope="row">{bebida.codigo}</th>
                        <td>{bebida.nome}</td>
                        <td>{bebida.ml_litro}</td>
                        <td>{bebida.preco}</td>
                        <td>{bebida.quantidade}</td>
                        <td>
                            <Link to={'/app/editarbebida/' + bebida.id}><i className="fas fa-edit icone-acao"></i></Link>
                            <Link to='#' onClick={() => props.clickDelete(bebida.id)}><i className="far fa-trash-alt icone-acao red"></i></Link>
                        </td>
                    </tr>
                })
            }


        </tbody>
    </table>
}

export default ListaBebida;