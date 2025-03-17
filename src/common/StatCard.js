/**
 * @fileoverview A simple card to display a statistic.
 */
import React from "react";
import PropTypes from "prop-types";

const StatCard = ({ stat, title }) => (
  <div className="col-sm-4 mb-3">
    <div className="card text-right">
      <div className="card-body">
        <h1 data-testid={title} className="display-4">
          {stat}
        </h1>
        <h5 className="card-title">{title}</h5>
      </div>
    </div>
  </div>
);

StatCard.propTypes = {
  stat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
};

export default StatCard;
