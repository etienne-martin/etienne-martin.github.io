import React, { AnchorHTMLAttributes, FC } from "react";
import classnames from "classnames";
import { styles } from "./Heading.style";

type HeadingTag = `h${1 | 2 | 3 | 4 | 5 | 6}`;

interface headingProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  as?: HeadingTag;
}

const makeHeading = (tag: HeadingTag): FC<headingProps> => {
  return function Heading({ as = tag, className, ...otherProps }) {
    return React.createElement(as, {
      ...otherProps,
      className: classnames(className, styles[tag]),
    });
  };
};

export const Heading = {
  h1: makeHeading("h1"),
  h2: makeHeading("h2"),
  h3: makeHeading("h3"),
  h4: makeHeading("h4"),
  h5: makeHeading("h5"),
  h6: makeHeading("h6"),
};
