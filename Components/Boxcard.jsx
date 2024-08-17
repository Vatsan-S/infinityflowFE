import React from 'react';

const Boxcard = ({info}) => {
    
    return (
        <div className='boxCard'>
            <div className="boxCardTitle">
                <p className='boxCategory'>{info.boxCategory}</p>
                <h4 className='boxName'>{info.boxName}</h4>
            </div>
            <p className='boxID'>{info.boxID}</p>
           
        </div>
    );
};

export default Boxcard;