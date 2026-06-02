import { useState } from "react";
import "./SearchItem.css";

export default function SearchItem({
  searchTitle,
  searchIncludeList,
  searchExcludeList,
  cheapestPrice,
  medianPrice,
  id,
  index,
  onClick,
  onEdit,
  onDelete,
}) {
  const handleViewClick = async (event) => {
    console.log(searchIncludeList);
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/search/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search: searchTitle,
          includeArr: searchIncludeList,
          excludeArr: searchExcludeList,
        }),
      });
      if (!response.ok) {
        throw new Error("Submission failed");
      }
      const data = await response.json();
      console.log(data);
      onClick(data, index);
    } catch (error) {
      console.error("Error connecting to backend");
    }
  };

  const handleEditClick = () => {
    onEdit(index);
  };

  const handleDeleteClick = async () => {
    try {
      const response = await fetch("http://localhost:3000/search/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });

      if (!response.ok) {
        throw new Error("Deletion failed");
      }

      const data = await response.json();
      console.log(data);
      onDelete(id);
    } catch (error) {
      console.error("Error connecting to backend");
    }
  };

  return (
    <div className="query-container">
      <div className="query-details">
        <div className="query-detail">
          <p className="heading">Query</p>
          <p className="data">{searchTitle}</p>
        </div>

        <div className="query-detail">
          <p className="heading">Included Words</p>
          <ul className="list-container">
            {searchIncludeList.map((includeWord, index) => (
              <li className="data" key={index}>
                {includeWord}
              </li>
            ))}
          </ul>
        </div>

        <div className="query-detail">
          <p className="heading">Excluded Words</p>
          <ul className="list-container">
            {searchExcludeList.map((excludeWord, index) => (
              <li className="data" key={index}>
                {excludeWord}
              </li>
            ))}
          </ul>
        </div>

        {/* finish styling the rest */}
        <button className="data" type="button" onClick={handleViewClick}>
          View Listings
        </button>

        <div className="query-detail">
          <p className="heading">Data</p>
          <p className="data">Cheapest price: ${cheapestPrice}</p>
          <p className="data">Median price: ${medianPrice}</p>
        </div>

        <div className="query-btns">
          <button className="data btn" type="button" onClick={handleEditClick}>
            Edit
          </button>
          <button
            className="data btn"
            type="button"
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
