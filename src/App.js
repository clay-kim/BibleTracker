import './App.css';
import { React, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import LoginForm from './Components/LoginForm';
import Home from './Pages/Home';
import Notes from './Pages/Notes';
import Bible from './Pages/Bible';
import ReadBible from './Pages/ReadBible';
import KoreanBibleData from './Components/Assets/bibleKOR.json';
import EnglishBibleData from './Components/Assets/Bible_EN_Kjv.json';

import { getFullBookName, koreanToEnglishBookNames } from './Components/BibleUtil.js';
import DailyVerse from './Components/DailyVerse.js';

function App() {

  const [randomVerse, setRandomVerse] = useState(null);

  useEffect(() => {
    setRandomVerse(getRandomVerse());
  }, []);

  function getRandomVerse() {
    // Generate a random index
    const randomBookIndex = Math.floor(Math.random() * EnglishBibleData.length);
    const randomBook = EnglishBibleData[randomBookIndex];
    const fullBookName = koreanToEnglishBookNames[getFullBookName(randomBook.abbrev)];

    // Select a random chapter
    const randomChapterIndex = Math.floor(Math.random() * randomBook.chapters.length);
    const randomChapter = randomBook.chapters[randomChapterIndex];

    // Select a random verse
    const randomVerseIndex = Math.floor(Math.random() * randomChapter.length);
    const randomVerse = randomChapter[randomVerseIndex];

    // Get the chapter and verse numbers
    const chapterNumber = randomChapterIndex + 1;
    const verseNumber = randomVerseIndex + 1;

    return {
      bookAbbreviations: randomBook.abbrev,
      book: fullBookName,
      verse: randomVerse,
      chapter: chapterNumber,
      verseNumber: verseNumber
    };
  }


  return (

    <div className="container">
      <Router>
        <Routes>
          <Route path="/dailyVerse" element={<DailyVerse randomVerse={randomVerse} />} />
          <Route path="/" element={<LoginForm />} />
          <Route path="/home" element={<Home randomVerse={randomVerse} />} />
          <Route path="/notes" element={<Notes randomVerse={randomVerse} />} />
          <Route path="/bible" element={<Bible randomVerse={randomVerse} />} />
          <Route path="/bible/:bookAbbrev" element={<ReadBible randomVerse={randomVerse} />} />
          <Route path="/bible/:bookAbbrev/:chapterNumber" element={<ReadBible randomVerse={randomVerse} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
