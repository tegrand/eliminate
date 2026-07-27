const validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      console.log(`[VALIDATE MIDDLEWARE] Source: ${source}`, req[source]);
      const parsedData = schema.parse(req[source]);
      
      if (source === "body") {
        req.validatedData = parsedData;
      } else {
        req[source] = parsedData;
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validate;
