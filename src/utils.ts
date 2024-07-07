export function RGBAtoRGB(fc: string, bc: string) {
  const fa = {
    r: HexToDec(fc.substring(0, 2)),
    g: HexToDec(fc.substring(2, 4)),
    b: HexToDec(fc.substring(4, 6)),
    a: fc.length > 6 ? HexToDec(fc.substring(6, 8)) / 255 : 1,
  };

  const ba = {
    r: HexToDec(bc.substring(0, 2)),
    g: HexToDec(bc.substring(2, 4)),
    b: HexToDec(bc.substring(4, 6)),
  };

  const a = fa.a;
  const modR = Math.round((1 - a) * ba.r + a * fa.r);
  const modG = Math.round((1 - a) * ba.g + a * fa.g);
  const modB = Math.round((1 - a) * ba.b + a * fa.b);
  const modColor =
    ("0" + modR.toString(16)).slice(-2) +
    ("0" + modG.toString(16)).slice(-2) +
    ("0" + modB.toString(16)).slice(-2);

  return modColor;
}

export function HexToDec(c: string) {
  if (RegExp(/^[a-f|0-9]+$/i).test(c)) {
    return parseInt(c, 16);
  } else {
    return 255;
  }
}

export function getsRGB(cNum: string) {
  const dec = HexToDec(cNum);
  let c = dec / 255;
  c = c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return c;
}

export function getL(c: string) {
  return (
    0.2126 * getsRGB(c.substring(0, 2)) +
    0.7152 * getsRGB(c.substring(2, 4)) +
    0.0722 * getsRGB(c.substring(4, 6))
  );
}

export function Dec2(numNum: number) {
  const num = String(numNum);
  if (num.indexOf(".") !== -1) {
    const numarr = num.split(".");
    if (numarr.length == 1) {
      return Number(num);
    } else {
      return Number(
        numarr[0] + "." + numarr[1].charAt(0) + numarr[1].charAt(1)
      );
    }
  } else {
    return Number(num);
  }
}

export function removeLeadingHash(color: string) {
  return color.replace(/^#/, "");
}

export function addLeadingHash(color: string) {
  return color.startsWith("#") ? color : `#${color}`;
}

export function checkContrast(color1: string, color0: string) {
  color1 = removeLeadingHash(color1);
  color0 = removeLeadingHash(color0);

  const fMod = RGBAtoRGB(color1, color0);
  const L1 = getL(fMod);
  const L2 = getL(color0);
  const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);

  return Dec2((ratio * 100) / 100);
}
