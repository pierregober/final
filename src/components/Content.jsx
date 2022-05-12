import React, { useState } from "react";
import {
  InputGroup,
  Button,
  InputGroupAddon,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
} from "reactstrap";
import { ingredients } from "../utils/ingredients";
import { useAuth0 } from "@auth0/auth0-react";
const axios = require("axios").default;

function Content() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const [text, setText] = useState("");
  const [showCards, setShowCards] = useState([]);

  const { user, loginWithRedirect } = useAuth0();

  function searchDrink(value) {
    if (value) {
      //search by ingredient
      const options = {
        method: "GET",
        url: "https://the-cocktail-db.p.rapidapi.com/filter.php",
        params: { i: value },
        headers: {
          "X-RapidAPI-Host": "the-cocktail-db.p.rapidapi.com",
          "X-RapidAPI-Key":
            "2937277847msh304966c3659a4a7p1d73aajsn7b6a9010ecda",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          console.log(response);
          if (response?.data?.drinks === "None Found") {
            alert("NO DRINKS FOUND, but search again please :)");
          } else {
            createCards(response?.data?.drinks);
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    } else {
      //search by drink name

      const options = {
        method: "GET",
        url:
          "https://cocktails3.p.rapidapi.com/search/byname/" + text.toString(),
        headers: {
          "X-RapidAPI-Host": "cocktails3.p.rapidapi.com",
          "X-RapidAPI-Key":
            "2937277847msh304966c3659a4a7p1d73aajsn7b6a9010ecda",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          if (response?.data?.body[0].length === 0) {
            alert("NO DRINKS FOUND, but search again please :)");
          } else {
            createCards(response?.data?.body[0]);
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }

  function createCards(data) {
    setShowCards(data);
  }

  //Logic to add to localstorage for favorite drinks by ingredient and by searched text
  function addFavorite(data, ingredients) {
    //add to favorites - ingredients if exsists
    if (ingredients) {
      if (window.localStorage.getItem(user.email + "-ingredients")) {
        const newIngredients = JSON.parse(
          window.localStorage.getItem(user.email + "-ingredients"),
        );
        newIngredients.push(data);
        window.localStorage.setItem(
          user.email + "-ingredients",
          JSON.stringify(newIngredients),
        );
      } else {
        //no data, create new
        window.localStorage.setItem(
          user.email + "-ingredients",
          JSON.stringify([data]),
        );
      }
    } else {
      if (window.localStorage.getItem(user.email + "-drinks")) {
        const drinks = JSON.parse(
          window.localStorage.getItem(user.email + "-drinks"),
        );
        drinks.push(data);
        window.localStorage.setItem(
          user.email + "-drinks",
          JSON.stringify(drinks),
        );
      } else {
        //no data, create new
        window.localStorage.setItem(
          user.email + "-drinks",
          JSON.stringify([data]),
        );
      }
    }
  }

  return (
    <div
      className="next-steps my-5"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2 className="my-5 text-center">Let's Search for Drinks!!</h2>
      <InputGroup>
        <Input
          placeholder="Search by cocktail name"
          onChange={(e) => setText(e.target.value)}
        />
        <InputGroupAddon addonType="append">
          <Button onClick={(e) => searchDrink(null)}>Search</Button>
        </InputGroupAddon>
      </InputGroup>
      <span className="lead">Or by ingredient</span>
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle>Show results by ingredient</DropdownToggle>
        <DropdownMenu
          modifiers={{
            setMaxHeight: {
              enabled: true,
              order: 890,
              fn: (data) => {
                return {
                  ...data,
                  styles: {
                    ...data.styles,
                    overflow: "auto",
                    maxHeight: "500px",
                  },
                };
              },
            },
          }}
        >
          {ingredients.map((ingredient) => {
            return (
              <DropdownItem
                onClick={(e) => {
                  searchDrink(ingredient);
                }}
                key={ingredient}
              >
                {ingredient}
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </Dropdown>
      <br />
      {showCards &&
        showCards.map((card) => {
          return (
            <Card>
              <CardBody>
                <CardTitle tag="h5">
                  {card.name
                    ? card.name.toUpperCase()
                    : card.strDrink.toUpperCase()}
                </CardTitle>
                <CardText>
                  {card.ingredients ? (
                    card?.ingredients?.map((ingredient) => {
                      return (
                        <>
                          <span key={ingredient}>{ingredient}</span>
                          <br />
                        </>
                      );
                    })
                  ) : (
                    <CardImg top width="30%" src={card.strDrinkThumb} alt="" />
                  )}
                </CardText>
                <div>
                  {user ? (
                    <Button
                      color="success"
                      onClick={() =>
                        addFavorite(card, card.strDrink ? true : false)
                      }
                    >
                      Add to Favorite
                    </Button>
                  ) : (
                    <Button color="success" onClick={() => loginWithRedirect()}>
                      Login to add to Favorites
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          );
        })}
    </div>
  );
}

export default Content;
