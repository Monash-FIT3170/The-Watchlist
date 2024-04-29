import React, {useState, useEffect} from 'react';
import { Log } from 'meteor/logging';
import Favourites from './Favourites';
import ToWatch from './ToWatch';

export const HomePage = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [contentData, setContentData] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [title, setTitle] = useState("");
  const [favourites, setFavourites] = useState([]);
  const [toWatchList, setToWatchList] = useState([]);



  return (
    <div className="homepage">
      <h1>HOME</h1>
      <div className="content-sections">
        <Favourites favourites={favourites} />
        <ToWatch toWatchList={toWatchList} />
      </div>
    </div>
  );
};
