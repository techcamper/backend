const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // copy req.query
  const reqQuery = { ...req.query };

  // fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit', 'links'];

  // loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // create query string
  let queryStr = JSON.stringify(reqQuery);

  // create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // finding resource
  query = model.find(JSON.parse(queryStr));

  // select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query.select(fields);
  }

  // sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query.sort(sortBy);
  } else {
    query.sort('-createdAt');
  }

  // pagination
  const ROWS_PER_PAGE = 15;
  const LINKS_PER_PAGE = 4;
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || ROWS_PER_PAGE;
  const qtyLinks = parseInt(req.query.links, 10) || LINKS_PER_PAGE;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments(JSON.parse(queryStr));
  query.skip(startIndex).limit(limit);

  // attach the relationships
  if (populate) {
    query.populate(populate);
  }

  // executing query
  const results = await query;

  // pagination result
  const pagination = {};

  if (results.length && (startIndex > 0 || endIndex < total)) {
    const hasPageQuery = req.query.page ? true : false;
    const delimiter = fullUrl.indexOf('?') < 0 ? '?' : '&';
    const prevLinks = page - qtyLinks < 1 ? 1 : page - qtyLinks;
    const nextLinks = page + qtyLinks > total ? total : page + qtyLinks;

    pagination.current = page;
    pagination.limit = limit;
    pagination.total = total;
    pagination.links = [];

    // next page number
    if (endIndex < total) {
      pagination.next = {
        path: hasPageQuery ? fullUrl.replace(`page=${page}`, `page=${page + 1}`) : `${fullUrl}${delimiter}page=${page + 1}`,
        page: page + 1,
      };
    }

    // previous page number
    if (startIndex > 0) {
      pagination.prev = {
        path: hasPageQuery ? fullUrl.replace(`page=${page}`, `page=${page - 1}`) : `${fullUrl}${delimiter}page=${page - 1}`,
        page: page - 1,
      };
    }

    // previous links
    for (let i = prevLinks; i < page; i++) {
      pagination.links.push({
        path: hasPageQuery ? fullUrl.replace(`page=${page}`, `page=${i}`) : `${fullUrl}${delimiter}page=${i}`,
        page: i,
        active: false,
      });
    }

    // current page
    pagination.links.push({
      path: fullUrl,
      page: page,
      active: true,
    });

    // next links
    for (let i = page + 1; i <= nextLinks; i++) {
      pagination.links.push({
        path: hasPageQuery ? fullUrl.replace(`page=${page}`, `page=${i}`) : `${fullUrl}${delimiter}page=${i}`,
        page: i,
        active: false,
      });
    }
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  };

  next();
}

module.exports = advancedResults;