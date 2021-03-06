import { signOut } from 'firebase/auth';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import auth from '../../../../firebase.init';
import FailedToFetch from '../../../shared/FailedToFetch';
import LoadingSpinner from '../../../shared/LoadingSpinner';
import UserRow from './UserRow';

const MakeAdmin = () => {
    const navigate = useNavigate();
    const [user] = useAuthState(auth);

    const { isLoading, error, data: users, refetch } = useQuery('users', () =>
        fetch('https://tools-manufacturer.herokuapp.com/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'From': user.email
            }
        }).then(res => {
            if (res.status !== 200) {
                signOut(auth);
                localStorage.removeItem('accessToken');
                navigate('/login');
                return toast.error(`Error ${res.status}`)
            }
            return res.json()
        }
        )
    );
    if (isLoading) {
        return <LoadingSpinner></LoadingSpinner>
    };
    if (error) {
        return <FailedToFetch></FailedToFetch>
    };
    return (
        <div className='card bg-base-200 shadow-xl'>
            <div className='overflow-x-auto card-body'>
                <h1 className='text-3xl font-bold mb-10'>All users</h1>
                <table className="table table-zebra w-full">
                    <thead>
                        <tr className='text-left text-xl font-bold'>
                            <th className='invisible'></th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((user, index) => <UserRow
                                key={user._id}
                                user={user}
                                index={index}
                                refetch={refetch}
                            ></UserRow>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MakeAdmin;