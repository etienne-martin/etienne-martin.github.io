import React, { AnchorHTMLAttributes, FC } from "react";
import classnames from "classnames";
import { styles } from "./Heading.style";

type headingProps = AnchorHTMLAttributes<HTMLAnchorElement>;

const makeHeading = (
  tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
): FC<headingProps> =>
  function Heading(props) {
    return React.createElement(tag, {
      ...props,
      className: classnames(styles.heading, props.className),
    });
  };

export const Heading = {
  h1: makeHeading("h1"),
  h2: makeHeading("h2"),
  h3: makeHeading("h3"),
  h4: makeHeading("h4"),
  h5: makeHeading("h5"),
  h6: makeHeading("h6"),
};
