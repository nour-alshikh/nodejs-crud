module.exports = (fn) => {
  return (req, res, next) => {
    // If the function returns a promise, handle it
    const result = fn(req, res, next);
    if (result && typeof result.catch === "function") {
      return result.catch((error) => next(error));
    }
    // If it's not a promise, just return the result
    return result;
  };
};
