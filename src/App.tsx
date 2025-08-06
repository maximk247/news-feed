import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout';
import NewsFeedPage from './modules/news-feed/pages/NewsFeedPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<NewsFeedPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
