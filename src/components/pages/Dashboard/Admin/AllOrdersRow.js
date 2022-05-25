import { signOut } from 'firebase/auth';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import auth from '../../../../firebase.init';

const AllOrdersRow = ({ order, index, refetch }) => {
    const navigate = useNavigate();

    const { _id, name, email, quantity, paid, shipped } = order;

    const handleShipping = (id) => {
        fetch(`https://tools-manufacturer.herokuapp.com/order/ship/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(res => {
                if (res.status === 401 || res.status === 403) {
                    signOut(auth);
                    localStorage.removeItem('accessToken');
                    navigate('/login');
                }
                return res.json()
            }
            )
            .then(data => refetch())
    }

    return (
        <tr>
            <td>{index + 1}</td>
            <td>{name}</td>
            <td>{email}</td>
            <td>{quantity}</td>
            <td>{paid ? 'Paid' : 'Unpaid'}</td>
            <td>{paid ? shipped ? 'Shipped' : <button className='btn btn-success' onClick={() => handleShipping(_id)}>Ship</button> : 'Payment Pending'}</td>
        </tr>
    );
};

export default AllOrdersRow;