import React from 'react';
import { useNavigate } from "react-router-dom";
import './DailyVerse.css';
import {getFullBookNameEng } from "./BibleUtil";

export const DailyVerse = (randomVerse) => {
    const { bookAbbreviations, book, chapter, verse, verseNumber } = randomVerse.randomVerse.randomVerse || {};

    const navigate = useNavigate();
    // read the chapter from 'daily scripture'
    const handleSearch = () => {
        navigate(`/bible/${bookAbbreviations}/${chapter}`);
    };

   const bookEng = getFullBookNameEng(book);

    return (
        <div className='daily-bible-verse'>
            <p className='title_top'>Daily Word of God</p>
            <p>{book} {chapter} : {verseNumber}</p>
            <p>"{verse}"</p>
            <p> Read more</p>
            <h4 className='readMore' onClick= {handleSearch} >{bookEng} {chapter}</h4>
        </div>

    )
}

export default DailyVerse;