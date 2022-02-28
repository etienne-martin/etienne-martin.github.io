export const isAbsoluteUrl = (url: string) => {
  return new RegExp(/^http(s)?:\/\//).test(url);
};
