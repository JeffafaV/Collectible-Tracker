import { useState } from "react";
import "./SearchListing.css";

export default function SearchListing({ listings }) {
  return (
    <div className="search-listings-container">
      {listings.map((listing, index) => {
        const shippingOption = listing.shippingOptions?.[0];
        const shippingCostType = shippingOption?.shippingCostType;
        const shippingCost = shippingOption?.shippingCost?.value;

        // console.log(shippingOption, shippingCostType, shippingCost);
        const totalPrice =
          Number(listing.price.value) +
          (shippingCostType === "FIXED" ? Number(shippingCost || 0) : 0);

        return (
          <div className="search-listing" key={index}>
            <div className="search-image">
              <img src={listing.image?.imageUrl || ""} />
            </div>

            <div className="search-details">
              <div className="search-detail">
                <p className="heading">Title:</p>
                <p className="data">{listing.title}</p>
              </div>

              <div className="search-detail">
                <p className="heading">Price:</p>
                <p className="data">
                  ${listing.price.value}
                  {/* {listing.price.currency} */}
                </p>
              </div>

              <div className="search-detail">
                <p className="heading">Shipping:</p>
                <p className="data">
                  {shippingCostType === "FIXED"
                    ? `$${shippingCost}`
                    : "Not Provided"}{" "}
                  | {shippingCostType || "Not provided"}
                </p>
                {/* <p className="data">
                  {shippingCostType === "FIXED"
                    ? `$${shippingCost}`
                    : "Not Provided"}
                </p> */}
              </div>

              {/* <p>
                Shipping Price:{" "}
                {shippingCostType === "FIXED"
                  ? `${shippingCost}${shippingOption.shippingCost.currency}`
                  : "Not Provided"}
              </p> */}
              <div className="search-detail">
                <p className="heading">Price:</p>
                <p className="data">${totalPrice}</p>
              </div>
              <div className="search-detail">
                <p className="data">
                  <a href={listing.itemWebUrl} target="_blank">
                    eBay
                  </a>
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
