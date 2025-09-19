import React from "react";
import PropTypes from "prop-types";

/**
 * ReusableAdvancedSearchBar - Feature-rich search/filter bar
 * @param {Array} fields - Array of field configs { name, label, type, options }
 * @param {object} values - Current values
 * @param {function} onChange - Change handler (name, value)
 * @param {function} onSearch - Search handler
 * @param {function} onReset - Reset handler
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 */
const ReusableAdvancedSearchBar = React.memo(
  function ReusableAdvancedSearchBar({
    fields,
    values,
    onChange,
    onSearch,
    onReset,
    className,
    style,
    ...props
  }) {
    return (
      <form
        className={`advanced-search-bar ${className || ""}`}
        style={style}
        onSubmit={(e) => {
          e.preventDefault();
          onSearch && onSearch();
        }}
        {...props}
      >
        {fields.map((field, idx) => {
          if (field.type === "select") {
            return (
              <label key={idx} style={{ marginRight: 8 }}>
                {field.label}
                <select
                  name={field.name}
                  value={values[field.name] || ""}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  style={{ marginLeft: 4 }}
                >
                  <option value="">All</option>
                  {field.options &&
                    field.options.map((opt, i) => (
                      <option key={i} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                </select>
              </label>
            );
          }
          return (
            <label key={idx} style={{ marginRight: 8 }}>
              {field.label}
              <input
                type={field.type || "text"}
                name={field.name}
                value={values[field.name] || ""}
                onChange={(e) => onChange(field.name, e.target.value)}
                style={{ marginLeft: 4 }}
              />
            </label>
          );
        })}
        <button type="submit" style={{ marginRight: 8 }}>
          Search
        </button>
        <button type="button" onClick={onReset}>
          Reset
        </button>
      </form>
    );
  }
);

ReusableAdvancedSearchBar.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      type: PropTypes.string,
      options: PropTypes.array,
    })
  ).isRequired,
  values: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

ReusableAdvancedSearchBar.defaultProps = {
  className: "",
  style: {},
};

export default ReusableAdvancedSearchBar;
