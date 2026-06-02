const axios = require("axios");
const Search = require("../models/search");

let cachedToken = null;
let tokenExp = 0;

async function getEbayToken() {
  if (cachedToken && Date.now() < tokenExp) {
    return cachedToken;
  }

  const credentials = Buffer.from(
    `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await axios.post(
    "https://api.ebay.com/identity/v1/oauth2/token",
    "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${credentials}`,
      },
    },
  );

  if (response) {
    cachedToken = response.data.access_token;
    tokenExp = Date.now() + response.data.expires_in * 1000;
  }

  return cachedToken;
}

// only keep listings that include ALL words in includeList
function filterListingsInclude(listings, includeList) {
  let tempListings = [];

  for (const listing of listings) {
    let flag = true;

    for (const includeWord of includeList) {
      if (!listing.title.toLowerCase().includes(includeWord.toLowerCase())) {
        flag = false;
      }
    }

    if (flag === true) {
      tempListings.push(listing);
    }
  }

  return tempListings;
}

// only keep listings that exclude ALL words in excludeList
function filterListingsExclude(listings, excludeList) {
  let tempListings = [];

  for (const listing of listings) {
    let flag = true;

    for (const excludeWord of excludeList) {
      // error
      if (listing.title.toLowerCase().includes(excludeWord.toLowerCase())) {
        flag = false;
      }
    }

    if (flag === true) {
      tempListings.push(listing);
    }
  }

  return tempListings;
}

exports.getSearches = async (req, res, next) => {
  try {
    const searches = await Search.find({}).lean();
    // console.log("Is searches an array? ", Array.isArray(searches));
    res.status(200).json(searches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSearch = async (req, res, next) => {
  const { search: query, includeList, excludeList } = req.body;
  console.log(query, includeList, excludeList);
  try {
    const { search: query, includeList, excludeList } = req.body;
    console.log(query, includeList, excludeList);
    const newSearch = new Search({
      search: query,
      includeWordList: includeList,
      excludeWordList: excludeList,
    });

    const savedSearch = await newSearch.save();
    res.status(201).json(savedSearch.toObject());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getListings = async (req, res, next) => {
  const {
    search: query,
    includeArr: includeList,
    excludeArr: excludeList,
  } = req.body;
  console.log(query, includeList, excludeList);
  // empty string counts as false
  // const query = req.query.q || "chimchar";
  const itemMax = "200";

  const token = await getEbayToken();
  let itemArr = [];
  // do while loop
  try {
    let response = await axios.get(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${query}&filter=itemLocationCountry:US&limit=${itemMax}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-EBAY-C-ENDUSERCTX": "contextualLocation=country=US,zip=92553",
        },
      },
    );

    console.log("First call", response.data.itemSummaries.length);
    itemArr = [...itemArr, ...response.data.itemSummaries];

    const maxIterations = 9;
    let iteration = 0;
    while (Object.hasOwn(response.data, "next") && iteration < maxIterations) {
      try {
        response = await axios.get(response.data.next, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        console.log("Remaining calls");
        itemArr = [...itemArr, ...response.data.itemSummaries];
      } catch (error) {
        console.error(
          "Error fetching eBay data (remaining calls):",
          error.response ? error.response.data : error.message,
        );
        res.status(500).json({ error: "Failed to fetch eBay data" });
      }

      iteration++;
    }

    itemArr = filterListingsInclude(itemArr, includeList);

    itemArr = filterListingsExclude(itemArr, excludeList);
    console.log(itemArr);

    // res.json(itemArr);
    res.json(itemArr);
  } catch (error) {
    console.error(
      "Error fetching eBay data (first call):",
      error.response ? error.response.data : error.message,
    );
    res.status(500).json({ error: "Failed to fetch eBay data" });
  }
};

exports.updateSearch = async (req, res, next) => {
  console.log("helelo)");
  try {
    const { id, search, includeList, excludeList } = req.body;
    console.log(id);
    const updatedSearch = await Search.findByIdAndUpdate(
      id,
      {
        search: search,
        includeWordList: includeList,
        excludeWordList: excludeList,
      },
      { new: true, runValidators: true },
    );

    if (!updatedSearch) {
      return res.Status(404);
    }
    console.log(updatedSearch);
    res.json(updatedSearch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSearch = async (req, res, next) => {
  console.log("holy shmoly", req.body);

  try {
    const id = req.body.id;

    const deletedItem = await Search.findByIdAndDelete(id);

    if (!deletedItem) {
      console.log("didn't work?!");
      return res.status(404);
    }

    console.log(deletedItem);
    res.status(200).json(deletedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
