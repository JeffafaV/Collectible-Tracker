import "./EditPopUp.css";

import { useState } from "react";

export default function EditPopUp({ isOpen, item, onEdit, onClose }) {
  if (isOpen === false) return null;

  const [search, setSearch] = useState(item.search);
  const [includeArr, setIncludeArr] = useState(item.includeArr);
  const [includeItem, setIncludeItem] = useState("");
  const [excludeArr, setExcludeArr] = useState(item.excludeArr);
  const [excludeItem, setExcludeItem] = useState("");

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
        console.log("include entered");
        const newIncludeArr = [...includeArr, includeItem];
        console.log(newIncludeArr);
        setIncludeArr(newIncludeArr);
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

  const handleEdit = async (event) => {
    event.preventDefault();
    // edit object to contain submitted content

    const editedItem = structuredClone(item);
    editedItem.search = search;
    editedItem.excludeArr = excludeArr;
    editedItem.includeArr = includeArr;
    console.log("edited", editedItem);

    onEdit(editedItem);
    handleClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <form
          onSubmit={(event) => {
            handleEdit(event);
          }}
        >
          <div>
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
          <div>
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
          <div>
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

          <div>
            <button type="submit">Edit</button>
            <button type="button" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </form>
        {/* <h2>Edit Search</h2>

        <label>Search</label>
        <input value={search} onChange={(e) => setSearch(e.target.value)} />

        <label>Include (comma separated)</label>
        <input
          value={includeArr}
          onChange={(e) => setIncludeArr(e.target.value)}
        />

        <label>Exclude (comma separated)</label>
        <input
          value={excludeArr}
          onChange={(e) => setExcludeArr(e.target.value)}
        />

        <div className="popup-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div> */}
      </div>
    </div>
  );
}
