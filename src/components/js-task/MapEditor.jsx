import React from "react";
import MapForm from "./form/MapForm";
import PureMap from "../common/PureMap";

export default class MapEditor extends React.Component {
  ENTER_KEY = "Enter";

  constructor(props) {
    super(props);

    this.state = {
      value: "",
      points: [],
      center: {
        lat: 55.734168,
        lng: 37.623938
      },
      directions: null,
      zoom: 16,
      isMarkerShown: true
    };
  }

  changePointsOrder = points => {
    this.setState({ points }, () => this.getRoute());
  };

  getMapProps = () => {
    return {
      googleMapURL:
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyDM_DVnbVRiQLfPIOwyDFbwg5X_HIG62_Y",
      loadingElement: <div style={{ height: "100%" }} />,
      containerElement: <div style={{ width: "70%", height: "600px" }} />,
      mapElement: <div style={{ height: "100%" }} />
    };
  };

  getMap = map => {
    this.map = map;
  };

  getMapCenter = () => {
    return this.map.getCenter();
  };

  handleValueChange = e => {
    const value = e.currentTarget.value;
    this.setState({ value });
  };

  createPoint = () => {
    const { value } = this.state;
    return {
      id: `_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      title: value,
      position: this.getMapCenter(),
      draggable: true,
      handleDragEnd: (index, marker) => this.handleMarkerDragEnd(index, marker)
    };
  };

  handleCreateButtonClick = () => {
    const { points } = this.state;
    const point = this.createPoint();
    points.push(point);
    const value = "";
    this.setState({ value, points }, () => this.getRoute());
  };

  handleDeleteButtonClick = id => {
    const { points } = this.state;
    const index = points.findIndex(point => point.id === id);
    points.splice(index, 1);
    const isPoints = points.length > 0;
    this.setState({ points }, () => {
      isPoints && this.getRoute();
    });
  };

  handleEnterPress = e => {
    if (e.key !== this.ENTER_KEY) {
      return;
    }
    this.handleCreateButtonClick();
  };

  handleMarkerDragEnd = (id, { latLng }) => {
    let { points } = this.state;
    const position = latLng;
    points = points.map((point) => (point.id === id ? { ...point, position } : point));
    this.setState({ points }, () => this.getRoute());
  };

  getRoute = () => {
    const { points } = this.state;
    const google = window.google;
    const DirectionsService = new google.maps.DirectionsService();
    const waypoints = points.map(({ position }) => ({
      location: position,
      stopover: true
    }));

    const origin = points[0].position;
    const destination = points[points.length - 1].position;

    DirectionsService.route(
      {
        origin,
        destination,
        waypoints,
        optimizeWaypoints: false,
        travelMode: google.maps.TravelMode.WALKING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result
          });
        } else {
          console.error(`Directions request failed due to ${result}`);
        }
      },
    );
  };

  render() {
    const { value, points, zoom, isMarkerShown, center, directions } = this.state;

    return (
      <div className={"map-editor outline-3"}>
        <MapForm
          value={value}
          onValueChange={this.handleValueChange}
          onCreateButtonClick={this.handleCreateButtonClick}
          onDeleteButtonClick={this.handleDeleteButtonClick}
          onEnterDown={this.handleEnterPress}
          points={points}
          changePointsOrder={this.changePointsOrder}
        />
        <PureMap
          map={this.map}
          isMarkerShown={isMarkerShown}
          getMapRef={this.getMap}
          getMapCenter={this.getMapCenter}
          zoom={zoom}
          center={center}
          onMarkerClick={this.handleMarkerClick}
          markers={points}
          directions={directions}
          {...this.getMapProps()}
        />
      </div>
    );
  }
}
