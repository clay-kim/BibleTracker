import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './NoteList.css';
import { getFullBookName, getFullBookNameEng } from '../Components/BibleUtil';


const customStyles = {
    content: {
        width: '65%',
        height: '50%',
        padding: '20px',
        border: '1px solid #ccc',
        background: 'rgba(2,42,91,0.9)',
        borderRadius: '14px',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 4px 8px rgba(238, 210, 220, 0.4)',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
    },
};

Modal.setAppElement('#root');

const NotesList = ({ userId, deleteNote }) => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        if (userId) {
            fetchNotes();
        }
    }, [userId]);

    // NOTE: 없으면 삭제가 보이는데 있으면 delete가 업데이트가 않됨
    useEffect(() => {
        if (userId) {
            fetchNotes();
        }
    }, [notes]);

    const fetchNotes = async () => {
        try {
            if (!userId) {
                console.log('User ID is empty.');
                return;
            }

            const response = await fetch(`https://mih7zrpt8g.execute-api.us-west-1.amazonaws.com/default/notes?userId=` + userId);
            if (response.ok) {
                const data = await response.json();
                setNotes(data);
            } else {
                console.error('Failed to fetch notes:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };


    const handleDelete = () => {
        if (selectedNote) {
            console.log('Delete this note:', selectedNote[0]);
            setNotes(notes.filter(note => note[0] !== selectedNote[0]));
            deleteNote(selectedNote[0]);
            closeModal();
        }
    };


    function openModal(note) {
        setSelectedNote(note);
        console.log('Modal opened', note);
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
        setSelectedNote(null);
    }


    return (
        <div className='notes-list'>
            <h2>Saved Notes</h2>
            {notes.map((note, index) => (
                <div key={index} className='note-item' onClick={() => openModal(note)}>
                    <h3>{getFullBookNameEng(getFullBookName(note[2]))} {note[3]}:{note[4]} - {note[5]}</h3>
                    <p>{note[6]}</p>
                </div>
            ))}


            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Note Content Modal"
            >
                {selectedNote && (
                    <div className='modal-window'>
                        <div className="button-container">
                            <h2>{getFullBookNameEng(getFullBookName(selectedNote[2]))} {selectedNote[3]}장 {selectedNote[4]} - {selectedNote[5]}절</h2>
                            <button className="modal-button" onClick={closeModal}>Close</button>
                        </div>
                        <p>{selectedNote[6]}</p>
                        <button className="modal-button" onClick={handleDelete}>Delete</button>
                        <h5>{selectedNote[7]}</h5>
                    </div>
                )}
            </Modal>

        </div>
    );
};

export default NotesList;
