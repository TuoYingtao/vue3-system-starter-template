const context = import.meta.glob('@/assets/**/*.svg');
const importAll = (importContext) => Object.keys(importContext);

const re = /\.\/(.*)\.svg/;
const icons = importAll(context).map((i) => {
  const str = i.split('/');
  const str2 = i.match(re)['1'].split('/');
  const name = str[str.length - 1];
  const value = str2[str2.length - 1];
  return {icon: name, stem: value};
});
export default icons;
