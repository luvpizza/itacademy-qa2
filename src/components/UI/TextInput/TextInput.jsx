import React from 'react';
import "./TextInput.scss"
const TextInput = ({className,...rest}) => {
    return (
    <input className={`${className} text-input`} {...rest}/>);
};

export default TextInput;