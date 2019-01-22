import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose, withProps, withHandlers } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  DirectionsRenderer
} from "react-google-maps";
import routeEditorActions from "../../store/actions/route-editor";

const MapContainer = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDM_DVnbVRiQLfPIOwyDFbwg5X_HIG62_Y",
    loadingElement: <div className={"loadingElement"} style={{ height: "100%" }} />,
    containerElement: <div className={"containerElement"} />,
    mapElement: <div className={"mapElement"} />
  }),
  withHandlers((props) => {
    const { getMapCenter } = props;
    const refs = { map: undefined };
    return {
      getRef: () => (ref) => {
        refs.map = ref;
      },
      getCenter: () => () => {
        getMapCenter(refs.map.getCenter());
      }
    };
  }),
  withScriptjs,
  withGoogleMap
)((props) => {
  const {
    getRef,
    getCenter,
    map: {
      zoom,
      center,
      points,
      directions
    }
  } = props;

  const markerList = points.map(({ id, position, draggable, handleDragEnd }) => (
    <Marker
      key={id}
      position={position}
      draggable={draggable}
      onDragEnd={handleDragEnd.bind(this, id)}
    />
  ));

  return (
    <GoogleMap
      ref={getRef}
      defaultZoom={zoom}
      defaultCenter={center}
      onCenterChanged={getCenter}
    >
      {markerList}
      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            suppressMarkers: true,
            preserveViewport: true
          }}
        />
      )}
    </GoogleMap>
  );
});


MapContainer.propTypes = {
  map: PropTypes.shape({
    zoom: PropTypes.number.isRequired,
    center: PropTypes.object.isRequired,
    directions: PropTypes.object,
    points: PropTypes.array.isRequired
  }).isRequired,
  getRef: PropTypes.func,
  getCenter: PropTypes.func
};

const mapStateToProps = (state) => {
  return { map: state.routeEditor.map };
};

const MapComponent = connect(
  mapStateToProps,
  routeEditorActions
)(MapContainer);

export default MapComponent;
