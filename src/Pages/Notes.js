import React, { useState, useMemo, useEffect } from 'react';
import './Notes.css';
import TopSearchBarMenu from '../Components/TopSearchBarMenu';
import SideBarMenu from '../Components/SideBarMenu';
import { FaRegLightbulb } from "react-icons/fa";
import DailyVerse from '../Components/DailyVerse';
import { getFullBookName, bookNames, koreanToEnglishBookNames } from '../Components/BibleUtil';
import KoreanBibleData from '../Components/Assets/bibleKOR.json';
import NotesList from './NoteList';



export const Notes = (randomVerse) => {
    const [showNav, setShowNav] = useState(true);
    const [selectedBook, setSelectedBook] = useState('');
    const [selectedChapter, setSelectedChapter] = useState('');
    const [startVerse, setStartVerse] = useState('');
    const [endVerse, setEndVerse] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [notes, setNotes] = useState([]);
    const [noteContent, setNoteContent] = useState('');
    const [userId, setUserId] = useState('');
    const bookAbbreviations = Object.keys(bookNames);


    useEffect(() => {
        const fetchNotes = async () => {
            const storedUserId = localStorage.getItem('userId');
            setUserId(storedUserId);

            if (storedUserId) {
                try {
                    const response = await fetch(`https://mih7zrpt8g.execute-api.us-west-1.amazonaws.com/default/notes?userId=${storedUserId}`);
                    const data = await response.json();


                    if (Array.isArray(data)) {

                        setNotes(data);
                        // console.log("[[NOTE]]:", data);

                    } else {
                        console.error('Fetched data is not an array:', data);
                    }

                } catch (error) {
                    console.error('Error fetching notes:', error);
                }
            } else {
                console.error('No userId found in localStorage');
            }
        };

        fetchNotes();
    }, [userId]);


    const handleStartVerseChange = (e) => {
        const input = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        setStartVerse(input);
    };
    const handleEndVerseChange = (e) => {
        const input = e.target.value.replace(/\D/g, '');
        setEndVerse(input);
    };


    const handleSubmit = async () => {
        // Construct the new note object
        const newNote = {
            userId: parseInt(userId, 10),
            book: selectedBook,
            chapter: parseInt(selectedChapter, 10),
            startVerse: parseInt(startVerse, 10),
            endVerse: parseInt(endVerse, 10),
            noteContent: noteContent,
            createdAt: new Date().toISOString(),
        };
        console.log(newNote);

        if (startVerse > endVerse && startVerse > 0) {
            alert('Starting verse should be less than or equal to ending verse');
            setStartVerse('');
            setEndVerse('');
            return;

        } else {

            const updatedNotes = [...notes, newNote];
            setNotes(updatedNotes);
            console.log("INFO::: ", notes);

            setSelectedBook('');
            setSelectedChapter('');
            setStartVerse('');
            setEndVerse('');
            setNoteContent('');
            setCharCount(0);

            try {
                const response = await fetch('https://mih7zrpt8g.execute-api.us-west-1.amazonaws.com/default/notes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newNote),
                });

                if (response.ok) {
                    const savedNote = await response.json();
                    setNotes([...notes, savedNote]);

                    // Clear input fields
                    setSelectedBook('');
                    setSelectedChapter('');
                    setStartVerse('');
                    setEndVerse('');
                    setNoteContent('');
                    setCharCount(0);
                } else {
                    alert('Failed to save the note');
                }
            } catch (error) {
                console.error('Error saving note:', error);
                alert('An error occurred while saving the note. Please try again later.');
            }
        }
    };



    const handleNoteChange = (e) => {
        const value = e.target.value;
        setNoteContent(value);
        // Remove spaces and update character count
        const charCountWithoutSpaces = value.replace(/\s/g, '').length;
        setCharCount(charCountWithoutSpaces);
    };


    const deleteNote = async (noteId) => {

        const deleteThisNote = {
            noteId: parseInt(noteId, 10),
            userId: parseInt(userId, 10),
        };

        try {
            const response = await fetch(`https://mih7zrpt8g.execute-api.us-west-1.amazonaws.com/default/notes`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(deleteThisNote),
            });

            if (response.ok) {
                console.log('Delete this note SUCCESS');
                setNotes(notes.filter(note => note.noteId !== noteId));
            } else {
                console.error('Failed to delete note:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };
    // Generating the list of books from the selected book
    // Tab Menu option
    const chapterOptions = useMemo(() => {
        if (!selectedBook) return [];
        const selectedBookData = KoreanBibleData.find((book) => book.abbrev === selectedBook);
        if (!selectedBookData) return [];
        return selectedBookData.chapters.map((_, index) => ({ label: index + 1, value: index + 1 }));
    }, [selectedBook]);




    return (
        <div className='dashboard'>
            <FaRegLightbulb onClick={() => setShowNav(!showNav)} className="hamburgerMenu" />
            <TopSearchBarMenu />

            <div className='homeMain-notes'>
                <DailyVerse randomVerse={randomVerse} />

                <SideBarMenu show={showNav} />

                <div className='dashboard-container'>

                    <div className='top-container-note'>
                        <div className='title-container'>
                        <p>Finding Wisdom in Words</p>
                    </div>
                    </div>

                    <div className='bottom-container-note'>
                        <div className='note-container-left'>

                            <div className='note-dropdown-container'>
                                <div className="note-SearchBar">
                                    <div className="note-announce">
                                        <h5>For recording scripture verses, please indicate the corresponding verses.</h5>
                                    </div>
                                    <div className="note-SearchBox">
                                        <div className="menu-container">
                                            <h6>Book</h6>
                                            <select className='inputBox'
                                                value={selectedBook}
                                                onChange={(e) => setSelectedBook(e.target.value)}
                                            >
                                                <option value=""></option>
                                                {bookAbbreviations.map((bookAbbrev) => (
                                                    <option key={bookAbbrev} value={bookAbbrev}>
                                                        {koreanToEnglishBookNames[getFullBookName(bookAbbrev)]}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>


                                        <div className="menu-container">
                                            <h6>Chapter</h6>
                                            <select className='inputBox'
                                                value={selectedChapter}
                                                onChange={(e) => setSelectedChapter(e.target.value)}
                                            >
                                                <option value=""></option>
                                                {chapterOptions.map((chapters) => (
                                                    <option key={chapters.value} value={chapters.value}>
                                                        {chapters.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="menu-container">
                                            <h6>Beginning</h6>
                                            <input className='inputBox'
                                                type="text"
                                                value={startVerse}
                                                onChange={handleStartVerseChange}
                                                placeholder="Verse"
                                            />
                                        </div>
                                        <div className="menu-container">
                                            <h6>End</h6>
                                            <input className='inputBox'
                                                type="text"
                                                value={endVerse}
                                                onChange={handleEndVerseChange}
                                                placeholder="Verse"
                                            />
                                        </div>
                                    </div>
                                    <button onClick={handleSubmit} className="note-SearchButton">Submit</button>
                                </div>
                            </div>
                            <div className='note-input-container'>
                                <form>
                                    <textarea className='inputField'
                                        type="text"
                                        value={noteContent}
                                        onChange={handleNoteChange}
                                        placeholder="Write reflections..."
                                    />
                                </form>
                                <div className='charCount'>Character count: {charCount}</div>
                            </div>
                        </div>
                        <div className='noteList-container'>
                            <NotesList userId={userId} notes={notes} deleteNote={deleteNote} />

                        </div>

                    </div>

                </div>


            </div>
        </div>
    )
}

export default Notes;