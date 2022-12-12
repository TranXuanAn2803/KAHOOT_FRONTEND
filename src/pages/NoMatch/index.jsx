import React from "react";
import { Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import Styled from "./style";
export const NoMatch = () => {
  return (
    <Styled>
      <section className="page_404">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 ">
              <div className="col-sm-10 col-sm-offset-1  text-center m-auto">
                <div className="four_zero_four_bg">
                  <h1 className="text-center ">404</h1>
                </div>
                <div className="contant_box_404">
                  <h3 className="h2">Look like you're lost</h3>
                  <p>the page you are looking for not available!</p>
                  <Link to="/home" className="link_404 btn btn-primary text-uppercase">
                    Go Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Styled>
  );
};

export default NoMatch;
