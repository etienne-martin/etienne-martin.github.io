import { FC } from "react";
import Highlight, { Language, Prism } from "prism-react-renderer";
import darkTheme from "prism-react-renderer/themes/dracula";
import { styles } from "./SyntaxHighlighting.style";
import classnames from "classnames";

interface PrismHighlightingProps {
  code: string;
  language: Language;
  highlightedLines?: number[];
  className?: string;
}

export const SyntaxHighlighting: FC<PrismHighlightingProps> = ({
  code,
  language,
  highlightedLines,
  className,
}) => {
  return (
    <Highlight Prism={Prism} theme={darkTheme} code={code} language={language}>
      {({ getLineProps, getTokenProps, ...props }) => (
        <code
          className={classnames(styles.code, className, props.className)}
          style={props.style}
        >
          {props.tokens.map((line, key) => {
            const { className, ...lineProps } = getLineProps({ line });
            const lineNumber = key + 1;

            return (
              <div
                key={key}
                className={classnames(className, styles.line, {
                  [styles.highlighted]: highlightedLines?.includes(lineNumber),
                })}
                {...lineProps}
              >
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            );
          })}
        </code>
      )}
    </Highlight>
  );
};
