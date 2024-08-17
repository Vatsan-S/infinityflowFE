import axios from "axios";
import React, { useEffect, useState } from "react";
import Boxcard from "../Components/Boxcard";
import { useNavigate } from "react-router-dom";
import Topheader from "../Components/Topheader";
import { SphereSpinner } from "react-spinners-kit";
const Boxcollection = () => {
  const [errMessage, setErrMessage] = useState("");
  const [boxdata, setBoxdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //   ==================================fetch data===============================
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        "https://infinityflowbe.onrender.com/api/box/getAllBox",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      setBoxdata(res.data.allBox);
    } catch (error) {
      setLoading(false);
      setErrMessage(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // -----------------handle click-------------
  const handleClick = (id) => {
    console.log("Working");
    navigate(`/box_details/${id}`);
  };
  return (
    <div>
      <Topheader />
      <div className="boxContainer">
        <h1>Box</h1>
        {loading === false ? (
          <>
            <div className="boxCollection">
              {loading
                ? "Loading..."
                : boxdata.map((ele, index) => {
                    return (
                      <div key={index} onClick={(e) => handleClick(ele._id)}>
                        <Boxcard info={ele} />
                      </div>
                    );
                  })}
            </div>
          </>
        ) : (
          <>
            <SphereSpinner size={20} color="#C2DEEB" loading={loading} />
          </>
        )}
      </div>
    </div>
  );
};

export default Boxcollection;
