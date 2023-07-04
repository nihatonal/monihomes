import React, { useState, useEffect, useContext } from 'react';
import { useHttpClient } from "../shared/hooks/http-hook";
import { AuthContext } from "../shared/context/auth-context";
import GuestTable from './components/GuestTable';
import LoadingSpinner from '../shared/UI/LoadingSpinner';
import DeleteModal from './components/DeleteModal';
import './User.css';
function User(props) {
    const auth = useContext(AuthContext);
    const { isLoading, sendRequest } = useHttpClient();
    const [startDate, setStartDate] = useState();
    const [info, setInfo] = useState('');
    const [endDate, setEndDate] = useState();
    const [guests, setGuests] = useState();
    const [show, setShow] = useState(false);
    const [deleteId, setDeleteId] = useState();
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + "/getdates",
                );
               
                setGuests(responseData.guests)
            } catch (err) { }
        };
        fetchUsers();

    }, [sendRequest]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const responseData = await sendRequest(
                process.env.REACT_APP_BACKEND_URL + "/savedates",
                "POST",
                JSON.stringify({
                    info: info,
                    dates: [startDate, endDate]
                }),
                {
                    "Content-Type": "application/json",
                }
            );
            setGuests([...guests, responseData.guest]);

        } catch (err) {
        }
    }
    const confirmDeleteHandler = async (e) => {
        e.preventDefault();
        console.log(e.target.parentNode.parentNode.parentNode.id)
        try {
            await sendRequest(
                process.env.REACT_APP_BACKEND_URL + `/${deleteId}`,
                "DELETE",
                null,
                {
                    Authorization: "Bearer " + auth.token,
                }
            );
            const posts = guests.filter((item) => item.id !== deleteId);
            setGuests(posts);
            setShow(false)
        } catch (err) { }
    };
    return (
        <div className="user_container">
            <div className="user_wrapper">

                <form className="inputs_container" onSubmit={submitHandler}>
                    <label htmlFor="startDate" className="input_label">
                        Check-in
                        <input type={'date'} value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                        <span></span>
                    </label>
                    <label htmlFor="startDate" className="input_label">
                        Check-out
                        <input type={'date'} value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                        <span></span>
                    </label>
                    <label htmlFor="startDate" className="input_label info_label">
                        Information
                        <textarea type={'text'} value={info} onChange={(e) => setInfo(e.target.value)} required />

                    </label>

                    <button
                        type="submit"
                        className={'save_btn'}
                        disabled={!startDate && !endDate && info.length < 0}
                    >
                        {isLoading ? <LoadingSpinner /> : 'Save'}
                    </button>
                </form>
                <DeleteModal show={show} delete={confirmDeleteHandler} cancel={() => setShow(false)} />
                <GuestTable data={guests} onDelete={(e) => {
                    setShow(true)
                    setDeleteId(e.target.parentNode.parentNode.parentNode.id)
                }} />
            </div>
        </div>
    );
}

export default User;