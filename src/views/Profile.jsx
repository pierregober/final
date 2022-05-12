/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";

import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

import {
  InputGroup,
  InputGroupAddon,
  Button,
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";

export const ProfileComponent = () => {
  const { user } = useAuth0();
  const [showIngredientCards, setShowIngredientCards] = useState();
  const [showDrinkCards, setShowDrinkCards] = useState();
  const [showCustomCards, setShowCustomCards] = useState();
  const [customTitle, setCustomTitle] = useState("");
  const [custom, setCustom] = useState();
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    //fetch localstorage stuff for user.
    setShowIngredientCards(
      JSON.parse(localStorage.getItem(user.email + "-ingredients")),
    );
    setShowDrinkCards(JSON.parse(localStorage.getItem(user.email + "-drinks")));
    setShowCustomCards(
      JSON.parse(localStorage.getItem(user.email + "-custom")),
    );
  }, [toggle]);

  function removeFav(data, key) {
    //remove from favorites by key
    const favArr = JSON.parse(window.localStorage.getItem(user.email + key));
    const filteredFavArr = favArr.filter((obj) => {
      if (key === "-ingredients") {
        if (obj["strDrink"] !== data["strDrink"]) {
          return obj;
        }
        setToggle(!toggle);
      } else {
        if (obj["name"] !== data["name"]) {
          return obj;
        }
        setToggle(!toggle);
      }
    });
    window.localStorage.setItem(
      user.email + key,
      JSON.stringify(filteredFavArr),
    );
  }

  function addDrink() {
    let addedDrink = { name: customTitle, ingredients: custom.split(",") };

    if (window.localStorage.getItem(user.email + "-custom")) {
      const newIngredients = JSON.parse(
        window.localStorage.getItem(user.email + "-custom"),
      );
      newIngredients.push(addedDrink);
      window.localStorage.setItem(
        user.email + "-custom",
        JSON.stringify(newIngredients),
      );
      setToggle(!toggle);
    } else {
      //no data, create new
      window.localStorage.setItem(
        user.email + "-custom",
        JSON.stringify([addedDrink]),
      );
      setToggle(!toggle);
    }
  }

  return (
    <>
      <Container className="mb-5">
        <Row className="align-items-center profile-header mb-5 text-center text-md-left">
          <Col md={2}>
            <img
              src={user.picture}
              alt="Profile"
              className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
            />
          </Col>
          <Col md>
            <h2>{user.name}</h2>
            <p className="lead text-muted">{user.email}</p>
          </Col>
        </Row>
      </Container>
      <Container className="mb-5">
        <div style={{ display: "flex" }}>Make your own drinks</div>
        <InputGroup>
          <input
            placeholder="Cocktail title"
            onChange={(e) => setCustomTitle(e.target.value)}
          />
          <textarea
            cols="400"
            rows="5"
            placeholder="Add cocktail ingredients seperated by commas, eg: 1.5oz vodka, 1.5oz lime juice , 3 ice cubes "
            onChange={(e) => setCustom(e.target.value)}
          />
          <InputGroupAddon addonType="append">
            <Button onClick={(e) => addDrink(null)}>Add</Button>
          </InputGroupAddon>
        </InputGroup>
      </Container>
      <h2>Custom Drinks</h2>
      <Container className="mb-5">
        <Row>
          {showCustomCards &&
            showCustomCards.map((card) => {
              return (
                <Card style={{ width: "fit-content" }}>
                  <CardBody width>
                    <CardTitle tag="h5">{card.name.toUpperCase()}</CardTitle>
                    {card?.ingredients?.map((ingredient) => {
                      return (
                        <>
                          <span key={ingredient}>{ingredient}</span>
                          <br />
                        </>
                      );
                    })}
                  </CardBody>
                  <Button
                    onClick={() => {
                      removeFav(card, "-custom");
                    }}
                    color="danger"
                  >
                    Remove
                  </Button>
                </Card>
              );
            })}
        </Row>
      </Container>
      <h2>Fav'd by Ingredient</h2>
      <Container className="mb-5">
        <Row>
          {showIngredientCards &&
            showIngredientCards.map((card, i) => {
              return (
                <Card style={{ width: "fit-content" }}>
                  <CardBody width>
                    <CardTitle tag="h5">
                      {card.strDrink.toUpperCase()}
                    </CardTitle>

                    <img width="200px" src={card.strDrinkThumb} alt="" />
                  </CardBody>
                  <Button
                    onClick={() => {
                      removeFav(card, "-ingredients");
                    }}
                    color="danger"
                  >
                    Remove
                  </Button>
                </Card>
              );
            })}
        </Row>
      </Container>
      <h2>Fav'd by Drink Name</h2>
      <Container className="mb-5">
        <Row>
          {showDrinkCards &&
            showDrinkCards.map((card) => {
              return (
                <Card style={{ width: "fit-content" }}>
                  <CardBody width>
                    <CardTitle tag="h5">{card.name.toUpperCase()}</CardTitle>
                    {card?.ingredients?.map((ingredient) => {
                      return (
                        <>
                          <span key={ingredient}>{ingredient}</span>
                          <br />
                        </>
                      );
                    })}
                  </CardBody>
                  <Button
                    onClick={() => {
                      removeFav(card, "-drinks");
                    }}
                    color="danger"
                  >
                    Remove
                  </Button>
                </Card>
              );
            })}
        </Row>
      </Container>
    </>
  );
};

export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
