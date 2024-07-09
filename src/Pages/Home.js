import React, { useState, useEffect } from 'react';
import './Home.css';
import TopSearchBarMenu from '../Components/TopSearchBarMenu';
import SideBarMenu from '../Components/SideBarMenu';
import { FaRegLightbulb } from "react-icons/fa";
import DailyVerse from '../Components/DailyVerse';
import PieChart from '../Components/PieChart';
import BarChartBible from '../Components/BarChartBible';
import { bibleGroups, categoryColors, getFullBookName, koreanToEnglishBookNames } from "../Components/BibleUtil";
import NotesList from './NoteList';


export const Home = (randomVerse) => {
    const [showNav, setShowNav] = useState(true);
    const [notes, setNotes] = useState([]);
    const [userId, setUserId] = useState('');

    /*
    ======== For the data from all notes, and reconstruct, and plug into the Chart =====
    */
    // Group notes by book name:
    // This is for sending notes as data for the Bar Charts
    const notesByBook = {};
    notes.forEach(note => {
        const bookAbbreviation = note[2];
        const rangeStart = note[4];
        const rangeEnd = note[5];
        const bookFullName = getFullBookName(bookAbbreviation);
        if (!notesByBook[bookFullName]) {
            notesByBook[bookFullName] = [];
        }
        notesByBook[bookFullName].push({ start: rangeStart, end: rangeEnd });
    });

    // Calculate the total range of verses for each book
    // !! NOTE: This needs to be done with validation for duplicated verses from same book
    const notesWithTotalRange = Object.keys(notesByBook).map(bookName => {
        const versesArray = notesByBook[bookName];
        const totalRange = versesArray.reduce((acc, curr) => {
            return acc + (curr.end - curr.start + 1);
        }, 0);
        return { book: bookName, totalRange: totalRange };
    });

    // functions to handle distribute data into corresponding book of bible
    const distributeProgressData = (progressData) => {
        // Initialize an object to store progress data for each group
        const groupedProgressData = {
            History: [],
            Poetry: [],
            Prophecy: [],
            Gospels: [],
            Epistles: []
        };
        // Initialize groupedProgressData with placeholder objects for each book
        Object.keys(bibleGroups).forEach(group => {
            bibleGroups[group].forEach(book => {
                groupedProgressData[group].push({ book: book, totalRange: 0 });
            });
        });

        // In order to put right data into corresponding book from bible, it needs to find the right book from looking at the index[]
        progressData.forEach(({ book, totalRange }) => {
            const englishBook = koreanToEnglishBookNames[book];
            if (!englishBook) {
                console.error(`No English equivalent found for Korean book: ${book}. ${book} might not belong to any of these categories`);
                return;
            }

            let found = false;
            Object.keys(bibleGroups).forEach(group => {
                const index = bibleGroups[group].indexOf(englishBook);
                if (index !== -1) {
                    //console.log(`Placing ${totalRange} in ${group} at index ${index} for book ${book}`);
                    groupedProgressData[group][index] = { book: englishBook, totalRange };
                    found = true;
                }
            });
            if (!found) {
                console.error(`Book not found in any group: ${englishBook}`);
            }
        });
        return groupedProgressData;
    };

    const groupedProgressData = distributeProgressData(notesWithTotalRange);


    // Calculate total verses read for Old Testament and New Testament
    const totalOldTestament = groupedProgressData.History.reduce((acc, { totalRange }) => acc + totalRange, 0) +
        groupedProgressData.Prophecy.reduce((acc, { totalRange }) => acc + totalRange, 0) +
        groupedProgressData.Poetry.reduce((acc, { totalRange }) => acc + totalRange, 0);

    const totalNewTestament = groupedProgressData.Gospels.reduce((acc, { totalRange }) => acc + totalRange, 0) +
        groupedProgressData.Epistles.reduce((acc, { totalRange }) => acc + totalRange, 0);

    const totalUnread = 31102 - (totalOldTestament + totalNewTestament);
    console.log("TESTING??", totalNewTestament, totalOldTestament, totalUnread);


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
                setNotes(notes.filter(note => note.noteId !== noteId));
            } else {
                console.error('Failed to delete note:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };



    return (
        <div className='dashboard'>
            <FaRegLightbulb onClick={() => setShowNav(!showNav)} className="hamburgerMenu" />
            <TopSearchBarMenu />

            <div className='homeMain-home'>
                <DailyVerse randomVerse={randomVerse} />
                <SideBarMenu show={showNav} />

                <div className='dashboard-container-home'>
                    <div className='title-container'>
                        <p>Reading Progress</p>
                    </div>
                    <div className='chart-container'>
                        <div className='bar-chart'>
                            <div className='chart-group'>
                                <BarChartBible
                                    group="History"
                                    books={bibleGroups["History"]}
                                    color={categoryColors["History"]}
                                    progressData={groupedProgressData.History}
                                />
                            </div>
                            <div className='chart-group'>
                                <BarChartBible
                                    group="Poetry"
                                    books={bibleGroups["Poetry"]}
                                    color={categoryColors["Poetry"]}
                                    progressData={groupedProgressData.Poetry}
                                />
                            </div>
                            {/* Repeat the above pattern for the remaining groups */}
                            <div className='chart-group'>
                                <BarChartBible
                                    group="Prophecy"
                                    books={bibleGroups["Prophecy"]}
                                    color={categoryColors["Prophecy"]}
                                    progressData={groupedProgressData.Prophecy}
                                />
                            </div>
                            <div className='chart-group'>
                                <BarChartBible
                                    group="Gospels"
                                    books={bibleGroups["Gospels"]}
                                    color={categoryColors["Gospels"]}
                                    progressData={groupedProgressData.Gospels}
                                />
                            </div>
                            <div className='chart-group'>
                                <BarChartBible
                                    group="Epistles"
                                    books={bibleGroups["Epistles"]}
                                    color={categoryColors["Epistles"]}
                                    progressData={groupedProgressData.Epistles}
                                />
                            </div>

                        </div>

                        <div className='duo-container'>
                            <div className='pie-chart'>
                                <PieChart
                                    maxWidth={550}
                                    maxHeight={550}
                                    dataRead={[totalOldTestament, totalNewTestament]}
                                />
                            </div>
                            <div className='recent-note-container'>
                                <NotesList userId={userId} notes={notes} deleteNote={deleteNote} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Home;