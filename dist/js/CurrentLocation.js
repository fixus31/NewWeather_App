export default class CurrentLocation {
    constructor() {
        this._name = "Current Location";
        this._lat = null;
        this._lon = null;
        this._unit = "imperial";
    }

    getName() {
        return this._name;
    }

    setName(name) {
        this._name = name;
    }

    getLatitude() {
        return this._latitude;

    }

    setLatitude(latitude) {
        this._latitude = latitude;
    }

    getLongitude() {
        return this._longitude;
    }

    setLongitude(longitude) {
        this._longitude = longitude;
    }

    getUnit() {
        return this._unit;
    }

    setUnit(unit) {
        this._unit = unit;
    }

    toggleUnit() {
        this._unit = this._unit === "imperial" ? "metric" : "imperial";
    }
}
