import "./item.css";

export default function Item({
  itemImage,
  itemTitle,
  itemPrice,
  itemCurrency,
  itemUrl,
}) {
  return (
    <div className="item-container">
      <div className="image-container">
        <img src={itemImage} />
      </div>
      <div className="detail-container">
        <p>{itemTitle}</p>
        <p>
          {itemPrice}
          {itemCurrency} |{" "}
          <a href={itemUrl} target="_blank">
            Link
          </a>
        </p>
      </div>
    </div>
  );
}
