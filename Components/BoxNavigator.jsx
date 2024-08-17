import React from 'react';
import { HiOutlineChevronDown } from "react-icons/hi";
const BoxNavigator = ({data}) => {
    // console.log("data",data)
    const identifierIcon = typeof data.boxName === 'string'? (data.boxName).slice(0,1):'';
    return (
        <div className='boxNavigatorContainer'>
            <div className="bxIcon">{identifierIcon}</div>
            <div className="bxContent">
                <h4>{data.boxName}</h4>
                <p>{data.boxCategory}</p>
            </div>
            <div className="bxArrow">
            <HiOutlineChevronDown />
            </div>
        </div>
    );
};

export default BoxNavigator;