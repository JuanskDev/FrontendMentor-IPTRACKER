import foto from "./images/fondo.png";
import arrow from "./images/icon-arrow.svg";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import { useEffect, useState } from "react";
import MarkerPosition from "./components/MarkerPosition/MarkerPosition";

const API_KEY = "at_Sj3xjS7XlWLqmV4Up0EOsX0cSoPGC";

function App() {
  const [address, setAddress] = useState(null);
  const [addressIp, setAddressIp] = useState("");

  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;

  useEffect(() => {
    try {
      const getInitialData = async () => {
        const res = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=2.2.8.8`
        );
        const data = await res.json();
        setAddress(data);
      };

      getInitialData();
    } catch (error) {
      console.trace(error);
    }
  }, []);

  const getNewLocation = async () => {
    const res = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&${
        checkIpAddress.test(addressIp)
          ? `ipAddress=${addressIp}`
          : checkDomain.test(addressIp)
          ? `domain=${addressIp}`
          : ""
      }`
    );
    const data = await res.json();
    setAddress(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getNewLocation();
    setAddressIp("");
  };

  return (
    <>
      <section className="">
        <div className="absolute ">
          <img src={foto} className="object-cover	h-80" alt="" />
        </div>
        <article className="relative">
          <h2 className=" text-center w-full text-2xl text-white py-5 lg:text-4xl">
            IP Address Tracker
          </h2>
          <form
            autoComplete="off"
            onSubmit={handleSubmit}
            className="flex justify-center sm:max-w-xl mx-auto mt-4 lg:mt10"
          >
            <input
              name="address"
              id="address"
              placeholder="Search for any IP address or domain"
              type="text"
              className=" py-3 px-8 rounded-l-lg w-3/4 sm:w-full"
              value={addressIp}
              onChange={(e) => setAddressIp(e.target.value)}
            />
            <button
              type="submit"
              className="bg-black py-4 px-3 hover:opacity-40 rounded-r-lg"
            >
              <img src={arrow} alt="" />
            </button>
          </form>
        </article>
        {address && (
          <>
            <article className="relative z-30 bg-white rounded-lg shadow p-4 mt-5 lg:mt-10 w-5/6 mx-auto flex-col lg:flex lg:flex-row  lg:max-w-2/3">
              <div className="div-article1 ">
                <p className="text-article">ip address</p>
                <h2 className="prop-article">{address.ip}</h2>
              </div>
              <div className="div-article">
                <p className="text-article">location</p>
                <h2 className="prop-article">{address.location.region}</h2>
              </div>
              <div className="div-article">
                <p className="text-article">TIMEZONE</p>
                <h2 className="prop-article">{address.location.timezone}</h2>
              </div>
              <div className="div-article">
                <p className="text-article">ISP</p>
                <h2 className="prop-article">{address.isp} </h2>
              </div>
            </article>
            <MapContainer
              center={[address.location.lat, address.location.lng]}
              zoom={13}
              scrollWheelZoom={true}
              className="h-100 w-full -top-32  relative lg:-top-16 z-20"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MarkerPosition address={address} />
            </MapContainer>
          </>
        )}
      </section>
    </>
  );
}

export default App;
