export const sendSuccess = (
  res,
  data,
  statusCode = 200,
  message = null,
  meta = {}
) => {
  const response = { success: true };

  if (message) response.message = message;
  if (data) response.data = data;
  if (Object.keys(meta).length > 0) response.meta = meta;

  return res.status(statusCode).json(response);
};
