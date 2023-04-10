import React from 'react';
import "./Repository.scss"
import star from "../../assets/icons/star.svg"
import { Link } from 'react-router-dom';
const Repository = ({id, name, stars, link}) => {
    return (
        <div className='repository__card' data-id={id}>
            <div className='repository__data'>
                <h1 className='repository__name'><Link to={"/card/" + id}>{name}</Link></h1>

                <div className="stars-box">
                    <img src={star} className='star' />
                    <p className='stars__count'>{stars}</p>
                </div>
            </div>
            <a href={link} target="#blank" className="repository__url">{link.slice(19)}</a>
        </div>
    );
};

export default Repository;