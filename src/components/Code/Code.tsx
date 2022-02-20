import { FC } from "react";
import Highlight, { Prism } from "prism-react-renderer";
import darkTheme from "prism-react-renderer/themes/dracula";
import { styles } from "./Code.style";

interface CodeProps {
  children?: string;
}

export const Code: FC<CodeProps> = ({ children }) => {
  return (
    <code className={styles.container}>
      <Highlight
        Prism={Prism}
        theme={darkTheme}
        code={children?.trim() ?? ""}
        language="jsx"
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, key) => (
              <div key={key} {...getLineProps({ line, key })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </code>
  );
};
