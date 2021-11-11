import React, { Component } from "react";
import OlMap from "ol/Map";
import OlView from "ol/View";
import OlLayerTile from "ol/layer/Tile";
import OlSourceOSM from "ol/source/OSM";
import { transform } from "ol/proj";
import GeoCode from "./coder";
import Axios from "axios";
class PublicMap extends Component {
  constructor(props) {
    super(props);

    this.state = { center: [0, 0], zoom: 1 };

    this.olmap = new OlMap({
      target: null,
      layers: [
        new OlLayerTile({
          source: new OlSourceOSM(),
        }),
      ],
      view: new OlView({
        center: this.state.center,
        zoom: this.state.zoom,
      }),
    });
  }

  updateMap() {
    this.olmap.getView().setCenter(this.state.center);
    this.olmap.getView().setZoom(this.state.zoom);
  }

  componentDidMount() {
    this.olmap.setTarget("map");

    // Listen to map changess
    this.olmap.on("moveend", () => {
      let center = this.olmap.getView().getCenter();
      let zoom = this.olmap.getView().getZoom();
      this.setState({ center, zoom });
    });
    this.olmap.on("singleclick", async (e) => {
      console.log(e);
      const coordinate = transform(e.coordinate, "EPSG:3857", "EPSG:4326");
      await this.setState({
        center: transform(e.coordinate, "EPSG:3857", "EPSG:4326"),
      });

      Axios.get(
        `https://api-adresse.data.gouv.fr/reverse/?lon=${coordinate[0]}&lat=${coordinate[1]}`
      ).then(({ data }) => {
        console.log(data); //  [ { source: 'OpenStreetMap', lng: -79.752502, lat: 43.715783,..}]
      });
      this.olmap.getView().setCenter(e.coordinate);
      this.olmap.getView().setZoom(5);
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    let center = this.olmap.getView().getCenter();
    let zoom = this.olmap.getView().getZoom();
    if (center === nextState.center && zoom === nextState.zoom) return false;
    return true;
  }

  userAction(e) {
    this.setState({ center: [546000, 6868000], zoom: 5 });
    console.log(e);
  }

  render() {
    this.updateMap(); // Update map on render?
    return (
      <div id="map" style={{ width: "100%", height: "360px" }}>
        <button onClick={(e) => this.userAction(e)}>setState on click</button>
      </div>
    );
  }
}

export default PublicMap;
