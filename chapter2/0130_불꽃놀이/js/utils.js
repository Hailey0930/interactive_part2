export const randomNumBetween = (min, max) => {
  return Math.random() * (max - min) + min;
};

// 화면 크기에 따라 불꽃 x,y 크기가 달라지도록 하는 util
export const hypotenuse = (x, y) => {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
};
