export const resolve = (specifier, context, nextResolve) => {
  return nextResolve(specifier, context);
};

export const load = (url, context, nextLoad) => {
  return nextLoad(url, context);
};

export const getFormat = (url, context, defaultGetFormat) => {
  if (url.endsWith('.ts')) {
    return { format: 'module' };
  }
  return defaultGetFormat(url, context);
};
