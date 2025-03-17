/**
 * @fileoverview A controlled text input field with built–in validation message.
 */
import React from "react";
import PropTypes from "prop-types";

const TextInput = ({ value, validationMessage, onChange, ...props }) => (
  <>
    <input
      type="text"
      className={`form-control form-control-sm${validationMessage ? " is-invalid" : ""}`}
      value={value}
      onChange={onChange}
      {...props}
    />
    {validationMessage && <div className="invalid-feedback">{validationMessage}</div>}
  </>
);

TextInput.propTypes = {
  value: PropTypes.string.isRequired,
  validationMessage: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

TextInput.defaultProps = {
  validationMessage: "",
};

export default TextInput;
