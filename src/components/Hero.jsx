import React from "react";

import logo from "../assets/logo.png";

const Hero = () => (
  <div className="text-center hero my-5">
    <img className="mb-3 app-logo" src={logo} alt="React logo" width="120" />
    <h1 className="mb-4">Cocktail Application</h1>

    <p className="lead">
      This is an application that allows you to search for your favorite
      cocktails. If you login you can also save your favorite ones to your
      profile!
    </p>
  </div>
);

export default Hero;
