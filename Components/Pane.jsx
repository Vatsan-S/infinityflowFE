import React from "react";
import Taskcard from "./Taskcard";
import SubtaskCard from "./SubtaskCard";
import { SphereSpinner } from "react-spinners-kit";
const Pane = ({ title, data, type, loading }) => {
 

  // console.log("data", data, title);
  const diff = title.slice(0, 1);
  let color;
  if (diff === "M") {
    color = "blue";
  } else if (diff === "T") {
    color = "purple";
  } else {
    color = "purpleDark";
  }

  return (
    <div className=" paneContainer">
      <h5 className="paneTitle">{title}</h5>
      <div className={`${color} pane`}>
        {(data && data.length >0 && loading === false) ?(type==="Task"?(
            <>
            {data.map((ele, index)=>{
                return(
                    <Taskcard key={index} ele={ele} />
                )
            })}
            </>
            ):type==="Subtask"?(
            <>
            {data.map((ele,index)=>{
                return(
                    <SubtaskCard key={index} ele={ele}/>
                )
            })}
            </>
        ):null):(<><SphereSpinner size={20} color="#C2DEEB" loading={loading} /> </>)}
      </div>
    </div>
  );
};

export default Pane;
