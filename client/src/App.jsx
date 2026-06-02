import { useState, useEffect } from "react";
import "./App.css";
import Item from "./item.jsx";
import SearchForm from "./components/SearchForm/SearchForm.jsx";
import SearchItem from "./components/SearchItem/SearchItem.jsx";
import SearchListing from "./components/SearchListing/SearchListing.jsx";
import EditPopUp from "./components/EditPopUp/EditPopUp.jsx";

function createSearchItem(
  id,
  search,
  includeArr = [],
  excludeArr = [],
  listings = [],
  cheapestPrice = 0,
  medianPrice = 0,
) {
  return {
    id,
    search,
    includeArr,
    excludeArr,
    listings,
    cheapestPrice,
    medianPrice,
  };
}

function App() {
  const [item, setItem] = useState([]);
  // const [searchStr, setSearchStr] = useState("");
  // const [includeArr, setIncludeArr] = useState([]);
  // const [excludeArr, setExcludeArr] = useState([]);
  const [searchItemArr, setSearchItemArr] = useState([]);
  const [popUpState, setPopUpState] = useState(false);

  useEffect(() => {
    const fetchSearches = async () => {
      try {
        const response = await fetch(`http://localhost:3000/search`, {
          method: "GET",
        });

        if (!response.ok) {
          console.log("Bad response!");
          return;
        }

        try {
          const data = await response.json();
          console.log(data);
          let tempArr = [];
          for (let i = 0; i < data.length; i++) {
            let item = createSearchItem(
              data[i]._id,
              data[i].search,
              data[i].includeWordList,
              data[i].excludeWordList,
            );

            tempArr.push(item);
          }
          setSearchItemArr(tempArr);
          // console.log(searchItemArr);
        } catch (error) {
          console.log("Failed to parse JSON!", error);
        }
      } catch (error) {
        console.log("Couldn't connect to backend!", error);
      }
    };

    fetchSearches();
  }, []);

  const handleEdit = async (item) => {
    // update item in mongodb
    try {
      const response = await fetch(`http://localhost:3000/search/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item.id,
          search: item.search,
          includeList: item.includeArr,
          excludeList: item.excludeArr,
        }),
      });

      if (!response.ok) {
        console.log("Bad response! egad");
        return;
      }

      try {
        const data = await response.json();
        console.log(
          `Did my edit function work? YES${JSON.stringify(data._id)}`,
        );
        console.log(searchItemArr[0]);
        // update state
        // const editedItemArr = structuredClone(searchItemArr);
        setSearchItemArr((prevItemsArr) =>
          prevItemsArr.map((item) =>
            item.id === data._id
              ? {
                  ...item,
                  search: data.search,
                  includeArr: data.includeWordList,
                  excludeArr: data.excludeWordList,
                }
              : item,
          ),
        );
      } catch (err) {
        console.log(err);
      }
      // const response = await
    } catch (error) {
      console.log(error);
    }

    console.log("yo");
  };

  const handleClose = () => {
    const tempPopUp = popUpState;
    if (tempPopUp === true) {
      console.log("hi cancel");
      setPopUpState(false);
    }
  };

  const handlePopUpState = (index) => {
    const newState = !popUpState;
    setPopUpState(newState);
    handleItemSelected(index, newState);
    console.log(`Edit Button # ${index} set popup to ${newState}`);
  };

  const handleItemSelected = (index, isOpen) => {
    let selectedItem = null;
    if (isOpen) {
      const state = popUpState;
      selectedItem = searchItemArr[index];
      setItem(selectedItem);
    } else {
      setItem(selectedItem);
    }
    console.log(selectedItem);
  };

  // all three in a JSON object rather than separate data?
  const handleSearchFormSubmit = (searchStr, includeArr, excludeArr) => {
    // setSearchStr(searchStr);
    // setIncludeArr(includeArr);
    // setExcludeArr(excludeArr);

    const newSearch = createSearchItem(searchStr, includeArr, excludeArr);

    setSearchItemArr((prevSearches) => [newSearch, ...prevSearches]);
  };

  const handleSearchItemClick = (listings, index) => {
    console.log(`button clicked on index ${index}`);
    const updatedItemArr = [...searchItemArr];

    listings.sort((a, b) => Number(a.price.value) - Number(b.price.value));

    updatedItemArr[index].listings = listings;
    // now lets update cheapest and median!
    // I don't think the frontend should be handling this
    updatedItemArr[index].cheapestPrice = listings[0].price.value;
    const middleIndex = Math.floor(listings.length / 2);
    updatedItemArr[index].medianPrice = listings[middleIndex].price.value;
    // console.log(updatedItemArr);
    setSearchItemArr(updatedItemArr);
  };

  const handleSearchItemDelete = (id) => {
    setSearchItemArr((prevItemsArr) =>
      prevItemsArr.filter((item) => item.id !== id),
    );
  };

  return (
    <div className="main-div">
      <div className="content-container">
        <div className="side-container">
          <SearchForm onSubmit={handleSearchFormSubmit} />
          <img
            src="/icon-removebg-preview - cropped.png"
            alt="My emotional support image"
          />
        </div>
        <div className="main-container">
          <ul className="search-container">
            {searchItemArr.map((searchItem, index) => (
              <li key={index}>
                <SearchItem
                  searchTitle={searchItem.search}
                  searchIncludeList={searchItem.includeArr}
                  searchExcludeList={searchItem.excludeArr}
                  cheapestPrice={searchItem.cheapestPrice}
                  medianPrice={searchItem.medianPrice}
                  id={searchItem.id}
                  index={index}
                  onClick={handleSearchItemClick}
                  onEdit={handlePopUpState}
                  onDelete={handleSearchItemDelete}
                />
                <SearchListing listings={searchItem.listings} />
              </li>
            ))}
          </ul>

          {/* <SearchItem
            searchTitle={searchStr}
            searchIncludeList={includeArr}
            searchExcludeList={excludeArr}
          /> */}
        </div>
      </div>

      {/* <ul>
        {items.map((item, index) => (
          <li key={index}>
            <Item
              itemImage={item.image.imageUrl}
              itemTitle={item.title}
              itemPrice={item.price.value}
              itemCurrency={item.price.currency}
              itemUrl={item.itemWebUrl}
            />
          </li>
        ))}
      </ul> */}
      <EditPopUp
        isOpen={popUpState}
        item={item}
        onEdit={handleEdit}
        onClose={handleClose}
      />
    </div>
  );
}

export default App;
