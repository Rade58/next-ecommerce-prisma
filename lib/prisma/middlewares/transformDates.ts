export default async (params: any, next: (params: any) => any) => {
  const result = await next(params);

  result.createdAt = (result.createdAt as Date).toISOString();
  result.updatedAt = (result.createdAt as Date).toISOString();

  return result;
};
