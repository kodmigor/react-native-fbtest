import React from "react";
import { CardItem } from "./CardItem";
import { products } from "../../data/products";

export default class CardList extends React.Component {
  render() {
    return (
      <div className="card-list outline-2">
        <CardItem />
        <CardItem />
        <CardItem />
      </div>
    );
  }
}
