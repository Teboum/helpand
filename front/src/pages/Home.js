import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import "react-slideshow-image/dist/styles.css";
import Inscription from "../comp/home/inscription";
import { useDispatch, useSelector } from "react-redux";
import Carousel from "react-bootstrap/Carousel";

import "./Home.css";

import Connexion from "../comp/home/Connexion";

function Home() {
  const history = useHistory();
  const userInfo = useSelector((state) => state.auth);
  const [url, setURL] = useState(history.location.search.substring(1));
  const images = [
    "slide/slide_1.png",
    "slide/slide_2.jpg",
    "slide/slide_3.jpg",
  ];
  useEffect(() => {
    history.listen(async (location) => {
      setURL(location.search.substring(1));
      console.log(url);
    });
  });

  return (
    <div className="home">
      <h1 className="home-title"> Entraide entre Particuliers</h1>
      <div className="home-main">
        <div className="home-left">
          {url === "" && (
            <>
              <h2 className="left-title">Demandeur De Services</h2>
              <div className="right">
                {" "}
                ICI ON PEUT METTRE CE QU'ON VEUT QUI EXPLIQUE DES CHOSES AU
                DEMANDEUR ....
              </div>
            </>
          )}
          {!userInfo && url === "inscription-demandeur" && (
            <Inscription link={"demandeur"}/> 
          )}
          {!userInfo && url === "connexion-demandeur" && (
            <Connexion helper={false} />
          )}
        </div>
        <div className="slide-container">
          <style type="text/css">
            {`
    .diapo-sss{
      border-radius:30px
    }
    `}
          </style>
          <Carousel>
            {images.map((e, i) => (
              <Carousel.Item
                interval={1000}
                key={i}
                prefixes={{ btn: "diapo" }}
              >
                <img className="d-block w-100" src={e} alt="First slide" />
                <Carousel.Caption>
                  <h3>First slide label</h3>
                  <p>
                    Nulla vitae elit libero, a pharetra augue mollis interdum.
                  </p>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
        <div className="home-right">
          {!userInfo && url === "inscription-prestataire" ? (
            <Inscription link={"helper"}/>
          ) : !userInfo && url === "connexion-prestataire" ? (
            <Connexion helper={true} />
          ) : (
            <>
              <h2 className="left-title">Demandeur De Services</h2>
              <div className="right">
                {" "}
                ICI ON PEUT METTRE CE QU'ON VEUT QUI EXPLIQUE DES CHOSES AU
                DEMANDEUR ....
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
