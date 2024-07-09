import React, { useState, useMemo } from "react";
import './TopSearchBarMenu.css';
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import KoreanBibleData from '../Components/Assets/bibleKOR.json';
import { getFullBookName, bookNames, getFullBookNameEng } from './BibleUtil.js';

export const TopSearchBarMenu = () => {
    const [selectedBook, setSelectedBook] = useState('');
    const [selectedChapter, setSelectedChapter] = useState('');
    const navigate = useNavigate();
    const [userName, setUserName] = useState(() => localStorage.getItem('userName'));
    const bookAbbreviations = Object.keys(bookNames);

    const handleLogout = () => {
        navigate('/', { replace: true });
    };

    const handleSearch = () => {
        navigate(`/bible/${selectedBook}/${selectedChapter}`);
    };

    // Generating the # of chapters from the selected book
    const chapterOptions = useMemo(() => {
        if (!selectedBook) return [];
        const selectedBookData = KoreanBibleData.find((book) => book.abbrev === selectedBook);
        if (!selectedBookData) return [];
        return selectedBookData.chapters.map((_, index) =>  ({ label: index + 1, value: index + 1 }));
    }, [selectedBook]);


    return (
        <div className="TopParWrapper">
            <div className="LeftTitle">
                <div className="Profile">
                    <FaUserCircle className="icon" />
                </div>
                <p>{userName}</p>
            </div>

            <div className="SearchBar">
                <p>Search Bible</p>
                <div className="SearchBox">
                    <div className="Dropdown">
                        <select
                            value={selectedBook}
                            onChange={(e) => setSelectedBook(e.target.value)}
                        >
                            <option value="">Book</option>
                            {bookAbbreviations.map((bookAbbrev) => (
                                <option key={bookAbbrev} value={bookAbbrev}>
                                    {getFullBookNameEng(getFullBookName(bookAbbrev))}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="Dropdown">
                        <select
                            value={selectedChapter}
                            onChange={(e) => setSelectedChapter(e.target.value)}
                        >
                            <option value="">Chapter</option>
                            {chapterOptions.map((chapters) => (
                                <option key={chapters.value} value={chapters.value}>
                                    Chapter {chapters.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={handleSearch} className="SearchButton">Search</button>
                </div>
            </div>

            <div className="Logout">
                <p onClick={handleLogout}>Logout</p>
            </div>
        </div>
    );

};

export default TopSearchBarMenu;