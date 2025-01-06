import React, { useState } from "react";
import "./Shipping.css";
import MetaData from "../../../utils/MetaData";
import { useCartContext } from "../../../context/cartContext";
import { useAuthContext } from "../../../context/authContext";
import Loader from "../../helper/loader/Loader";
import CheckOutSteps from "../checkOutSteps/CheckOutSteps";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PinDropIcon from "@mui/icons-material/PinDrop";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import PublicIcon from "@mui/icons-material/Public";
import { Country, State } from "country-state-city";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Shipping = () => {
  const { shippingInfo, saveShippingInfo } = useCartContext();

  const [address, setAddress] = useState(shippingInfo.address || "");
  const [city, setCity] = useState(shippingInfo.city || "");
  const [state, setState] = useState(shippingInfo.state || "");
  const [country, setCountry] = useState(shippingInfo.country || "");
  const [pinCode, setPinCode] = useState(shippingInfo.pinCode || "");
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || "");

  const { loading } = useAuthContext();
  const navigate=useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!phoneNo || phoneNo.length !== 10) {
      alert.error("Phone number must be 10 digits.");
      return;
    }

    // Save shipping information to context
    saveShippingInfo({ address, city, state, country, pinCode, phoneNo });
    toast.success("Shipping information saved successfully!");

    // Reset form fields
    setAddress("");
    setCity("");
    setState("");
    setCountry("");
    setPinCode("");
    setPhoneNo("");

    navigate('/order/confirm')
  };
  return (
    <>
      <MetaData title="Shipping" />
      {loading ? (
        <Loader />
      ) : (
        <>
          <CheckOutSteps activeStep={0} />
          <div className="shippingContainer">
            <div className="shippingBox">
              <h2 className="shippingHeading">Shipping Details</h2>
              <form onSubmit={handleSubmit} className="shippingForm">
                <div>
                  <HomeIcon />
                  <input
                    onChange={(e) => setAddress(e.target.value)}
                    value={address}
                    type="text"
                    name="address"
                    id="address"
                    required
                    placeholder="Address..."
                  />
                </div>
                <div>
                  <LocationCityIcon />
                  <input
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
                    type="text"
                    name="city"
                    id="city"
                    required
                    placeholder="City..."
                  />
                </div>
                <div>
                  <PinDropIcon />
                  <input
                    onChange={(e) => setPinCode(e.target.value)}
                    value={pinCode}
                    type="number"
                    name="pinCode"
                    id="pinCode"
                    required
                    placeholder="Pin Code..."
                  />
                </div>
                <div>
                  <PinDropIcon />
                  <input
                    onChange={(e) => setPhoneNo(e.target.value)}
                    value={phoneNo}
                    type="number"
                    name="phone"
                    id="phoneNo"
                    required
                    placeholder="Phone Number..."
                  />
                </div>
                <div>
                  <PublicIcon />
                  <select
                    onChange={(e) => setCountry(e.target.value)}
                    value={country}
                    name="country"
                    id="country"
                    required
                  >
                    <option value="">Country</option>
                    {Country.getAllCountries().map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {" "}
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                {country && (
                  <div>
                    <TransferWithinAStationIcon />
                    <select
                      required
                      name="state"
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    >
                      <option value="">State</option>
                      {State.getStatesOfCountry(country).map((item) => (
                        <option key={item.isoCode} value={item.isoCode}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <input type="submit" value="Continue" className="shippingBtn" disabled={!address || !city || !state || !country || !pinCode || !phoneNo} />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Shipping;
