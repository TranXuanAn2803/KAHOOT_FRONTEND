import React from "react";
import { Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import Styled from "./style";
export const NoMatch = () => {
  return (
    <Styled>
      <div className="not-found">
        <img
          src="https://www.pngitem.com/pimgs/m/561-5616833_image-not-found-png-not-found-404-png.png"
          alt="not-found"
        />
        <Link to="/" className="link-home">
          Go Home
        </Link>
      </div>
    </Styled>
  );
};

export default NoMatch;
