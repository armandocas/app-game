import React from 'react';
import { Link } from 'react-router-dom';
import './listaborda.css';

function ListaBorda(props) {

    return <table className="table table-hover table-bordered">
        <thead>
            <tr className="table-secondary">
                <th scope="col">Código</th>
                <th scope="col">Nome</th>
                <th scope="col">Valor</th>
                <th scope="col" className="col-acao"></th>
            </tr>
        </thead>
        <tbody>

            {
                props.arrayBordas.map((borda) => {
                    return <tr key={borda.id}>
                        <th scope="row">{borda.codigo}</th>
                        <td>{borda.nome}</td>
                        <td>{borda.preco}</td>
                        <td>
                            <Link to={'/app/editarborda/' + borda.id}><i className="fas fa-edit icone-acao"></i></Link>
                            <Link to='#' onClick={() => props.clickDelete(borda.id)}><i className="far fa-trash-alt icone-acao red"></i></Link>
                        </td>
                    </tr>
                })
            }


        </tbody>
    </table>
}

export default ListaBorda;