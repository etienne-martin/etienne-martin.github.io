import React, { FC, ImgHTMLAttributes } from "react";
import classnames from "classnames";
import { styles } from "./Image.style";

type ImageProps = ImgHTMLAttributes<HTMLImageElement>;

export const Image: FC<ImageProps> = ({ alt, className, ...otherProps }) => {
  return (
    <img
      alt={alt}
      className={classnames(styles.image, className)}
      {...otherProps}
    />
  );
};
