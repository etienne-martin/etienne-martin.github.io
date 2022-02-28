import { FC, HTMLAttributes } from "react";
import classnames from "classnames";
import { styles } from "./Divider.style";

type DividerProps = HTMLAttributes<HTMLHRElement>;

export const Divider: FC<DividerProps> = ({ className, ...otherProps }) => {
  return (
    <hr className={classnames(styles.divider, className)} {...otherProps} />
  );
};
