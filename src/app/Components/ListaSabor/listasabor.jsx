import React from 'react';
import { Link } from 'react-router-dom';
import './listasabor.css';

function ListaSabor(props) {

    return <table className="table table-hover table-bordered">
        <thead>
            <tr className="table-secondary">
                <th scope="col">Código</th>
                <th scope="col">Sabor</th>
                <th scope="col">Ingredientes</th>
                <th scope="col">Preço</th>
                <th scope="col" className="col-acao"></th>
            </tr>
        </thead>
        <tbody>

            {
                props.arrayPizzas.map((pizza) => {
                    return <tr key={pizza.id}>
                        <th scope="row">{pizza.codigo}</th>
                        <td>{pizza.sabor}</td>
                        <td>{pizza.ingredientes}</td>
                        <td>{pizza.preco}</td>
                        <td>
                            <Link to={'/app/editarsabor/' + pizza.id}><i className="fas fa-edit icone-acao"></i></Link>
                            <Link to='#' onClick={() => props.clickDelete(pizza.id)}><i className="far fa-trash-alt icone-acao red"></i></Link>
                        </td>
                    </tr>
                })
            }


        </tbody>
    </table>
}

export default ListaSabor;