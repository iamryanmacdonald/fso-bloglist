import PropTypes from "prop-types";
import { forwardRef, useImperativeHandle, useState } from "react";

const Togglable = forwardRef(({ buttonLabel, children }, refs) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div>
      <div style={{ display: visible ? "none" : "" }}>
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div style={{ display: visible ? "" : "none" }}>
        {children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  );
});

Togglable.displayName = "Togglable";

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default Togglable;
