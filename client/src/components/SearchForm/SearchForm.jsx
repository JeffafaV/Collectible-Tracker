import "./SearchForm.css";

import { useState } from "react";

export default function SearchForm({ onSubmit }) {
  const [search, setSearch] = useState("");
  const [includeArr, setIncludeArr] = useState([]);
  const [includeItem, setIncludeItem] = useState("");
  const [excludeArr, setExcludeArr] = useState([]);
  const [excludeItem, setExcludeItem] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    onSubmit(search, includeArr, excludeArr);

    try {
      const response = await fetch(`http://localhost:3000/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search: search,
          includeList: includeArr,
          excludeList: excludeArr,
        }),
      });

      if (!response.ok) {
        console.log("Bad response!");
        return;
      }

      try {
        const data = await response.json();
        console.log("This is what I got after calling getSearches: ", data);
      } catch (error) {
        console.log("Couldn't parse to JSON!", error);
      }
    } catch (error) {
      console.log("Couldn't connect to backend! ", error);
    }

    setSearch("");
    setIncludeArr([]);
    setIncludeItem("");
    setExcludeArr([]);
    setExcludeItem("");
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSearchEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const handleIncludeEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (includeItem) {
        setIncludeArr([...includeArr, includeItem]);
        setIncludeItem("");
      }
    }
  };

  const handleIncludeChange = (event) => {
    setIncludeItem(event.target.value);
  };

  const handleIncludeClick = (event, indexToDelete) => {
    const newInludeList = includeArr.filter(
      (includeWord, index) => index !== indexToDelete,
    );
    setIncludeArr(newInludeList);
  };

  const handleExcludeEnter = (event) => {
    if (event.key === "Enter" && excludeItem) {
      event.preventDefault();

      if (excludeItem) {
        setExcludeArr([...excludeArr, excludeItem]);
        setExcludeItem("");
      }
    }
  };

  const handleExcludeChange = (event) => {
    setExcludeItem(event.target.value);
  };

  const handleExcludeClick = (event, indexToDelete) => {
    const newExludeList = excludeArr.filter(
      (excludeWord, index) => index !== indexToDelete,
    );
    setExcludeArr(newExludeList);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="input-fields">
        <div className="input-field">
          <label htmlFor="search">Query</label>
          <input
            type="text"
            id="search"
            name="search"
            value={search}
            onChange={handleSearchChange}
            onKeyDown={handleSearchEnter}
          />
        </div>
        <div className="input-field">
          <label htmlFor="include">Include Word</label>
          <input
            type="text"
            id="include"
            name="include"
            value={includeItem}
            onKeyDown={handleIncludeEnter}
            onChange={handleIncludeChange}
          />
        </div>
        <p>Include these words in listing:</p>
        <ul className="word-list">
          {includeArr.map((includeWord, index) => (
            <li key={index} onClick={(e) => handleIncludeClick(e, index)}>
              {includeWord}
            </li>
          ))}
        </ul>
        <div className="input-field">
          <label htmlFor="exclude">Exclude Word</label>
          <input
            type="text"
            id="exclude"
            name="exclude"
            value={excludeItem}
            onKeyDown={handleExcludeEnter}
            onChange={handleExcludeChange}
          />
        </div>
        <p>Exclude these words in listing:</p>
        <ul className="word-list">
          {excludeArr.map((excludeWord, index) => (
            <li key={index} onClick={(e) => handleExcludeClick(e, index)}>
              {excludeWord}
            </li>
          ))}
        </ul>
      </div>

      <input className="form-button" type="submit" value="Add Query" />
      <p>{search}</p>
    </form>
  );
}
