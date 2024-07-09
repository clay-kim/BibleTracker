import React, { useState, useEffect } from 'react';
import './ReadBible.css';
import TopSearchBarMenu from '../Components/TopSearchBarMenu';
import SideBarMenu from '../Components/SideBarMenu';
import { FaRegLightbulb } from "react-icons/fa";
import { useParams } from 'react-router-dom';
import KoreanBibleData from '../Components/Assets/bibleKOR.json';
import EnglishBibleData from '../Components/Assets/Bible_EN_Kjv.json';
import { useNavigate } from "react-router-dom";
import DailyVerse from '../Components/DailyVerse.js';

export const ReadBible = (randomVerse) => {
    const [showNav, setShowNav] = useState(true);
    const { book, chapter, verse, verseNumber } = randomVerse.randomVerse || {};
    const { bookAbbrev, chapterNumber } = useParams();
    const navigate = useNavigate();
    const selectedBook = EnglishBibleData.find(book => book.abbrev === bookAbbrev);

    // State to hold the current chapter number
    const [currentChapter, setCurrentChapter] = useState(parseInt(chapterNumber) || 1);

    useEffect(() => {
        // Re-render bible content based on the current chapter
        setCurrentChapter(parseInt(chapterNumber) || 1);
    }, [chapterNumber]);


    // Function to get the content of the current chapter
    const getCurrentChapterContent = () => {
        if (selectedBook) {
            const currentChapterContent = selectedBook.chapters[currentChapter - 1];
            return currentChapterContent ? currentChapterContent : [];
        }
        return [];
    };

    // Content of the current chapter
    const currentChapterContent = getCurrentChapterContent();


    // Handler function for going forward and backward chapter
    const handleNextChapter = () => {
        if (currentChapter < selectedBook.chapters.length) {
            setCurrentChapter(currentChapter + 1);
            navigate(`/bible/${selectedBook.abbrev}/${currentChapter + 1}`);
        }
    };
    const handlePreviousChapter = () => {
        if (currentChapter > 1) {
            setCurrentChapter(currentChapter - 1);
            navigate(`/bible/${selectedBook.abbrev}/${currentChapter - 1}`);
        }
    };


    return (
        <div className='dashboard'>
            <FaRegLightbulb onClick={() => setShowNav(!showNav)} className="hamburgerMenu" />
            <TopSearchBarMenu />

            <div className='homeMain-home'>
            <DailyVerse randomVerse={randomVerse} />
                <SideBarMenu show={showNav} />

                <div className='dashboard-container-readBible'>
                    <div className='title-container'>
                        <div className='verse-info'>
                            <h2>{selectedBook ? selectedBook.name : ''}</h2>
                            <h4>Chapter {currentChapter}</h4>
                            <div className='button-container'>
                                <button onClick={handlePreviousChapter} className="chapterButton">Previous Chapter</button>
                                <button onClick={handleNextChapter} className="chapterButton">Next Chapter</button>
                            </div>
                        </div>
                    </div>

                    <div className='verse-container'>
                        {currentChapterContent.map((verse, index) => (
                            <p key={index}> 
                            <span className="verse-number">{index + 1}. </span>{verse}</p>
                        ))}

                    </div>

                </div>
            </div>

        </div>
    )
}
export default ReadBible;