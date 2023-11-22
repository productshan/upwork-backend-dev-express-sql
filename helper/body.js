function checkFields(fields) {
  return (req, res, next) => {
    const errors = [];

    for (const field of fields) {
      if (!req.body[field]) {
        errors.push({ field, message: `${field} is required` });
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    next();
  };
}

const wrapper = {
  checkFields: checkFields
};

module.exports = wrapper;
