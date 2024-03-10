export function getLogoSrc(fileName, marketCode) {
  try {
    return require(`@/assets/assets/img/list/${fileName}/${marketCode}.png`);
  } catch (error) {
    return require('@/assets/img/temp_image.png');
  }
}

