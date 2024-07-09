import React, { useState } from 'react';
import './Bible.css';
import TopSearchBarMenu from '../Components/TopSearchBarMenu';
import SideBarMenu from '../Components/SideBarMenu';
import { FaRegLightbulb } from "react-icons/fa";
import KoreanBibleData from '../Components/Assets/bibleKOR.json';
import EnglishBibleData from '../Components/Assets/Bible_EN_Kjv.json';
import { getFullBookName, bookNames, getFullBookNameEng } from '../Components/BibleUtil.js';
import { Link } from 'react-router-dom';
import DailyVerse from '../Components/DailyVerse.js';

export const Bible = (randomVerse) => {
    const [showNav, setShowNav] = useState(true);
    const handleBookClick = (bookAbbrev) => {
        const selectedBook = EnglishBibleData.find(book => book.abbrev === bookAbbrev);
        if (selectedBook) {

        } else {
            console.log(`Book ${bookAbbrev} not found in EnglishBibleData.`);
        }
    };

    return (
        <div className='dashboard'>
            <FaRegLightbulb onClick={() => setShowNav(!showNav)} className="hamburgerMenu" />
            <TopSearchBarMenu />

            <div className='homeMain-bible'>
                <DailyVerse randomVerse={randomVerse} />

                <SideBarMenu show={showNav} />

                <div className='dashboard-container-bible'>
                    <div className='title-container'>
                        <p>Word of God</p>
                    </div>
                    <div className='bottom-container'>
                        <div className='b-1'>
                            <h1>Old</h1>
                            <ul className="book-list">
                                {Object.keys(bookNames).slice(0, 39).map((bookAbbrev) => (
                                    <li key={bookAbbrev}>
                                        <Link to={`/bible/${bookAbbrev}`} className="book-link" onClick={() => handleBookClick(bookAbbrev)}>{getFullBookNameEng(getFullBookName(bookAbbrev))}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className='b-2'>
                            <h1>New</h1>
                            <ul className="book-list">
                                {Object.keys(bookNames).slice(39, 66).map((bookAbbrev) => (
                                    <li key={bookAbbrev}>
                                        <Link to={`/bible/${bookAbbrev}`} className="book-link" onClick={() => handleBookClick(bookAbbrev)}>{getFullBookNameEng(getFullBookName(bookAbbrev))}</Link>
                                    </li>
                                ))}
                            </ul>

                        </div>

                    </div>
                </div>


            </div>

        </div>
    )
}

export default Bible;