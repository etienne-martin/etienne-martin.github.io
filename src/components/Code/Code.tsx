import { FC } from "react";
import { Language } from "prism-react-renderer";
import { styles } from "./Code.style";
import { Clipboard } from "../Clipboard";
import { SyntaxHighlighting } from "../SyntaxHighlighting";
import { CodeRunner } from "../CodeRunner";

interface CodeProps {
  children?: string;
  className?: string;
  highlight?: string;
}

export const Code: FC<CodeProps> = ({ children, className, highlight }) => {
  const language = (className?.replace(/^language-/, "") ?? "") as Language;
  const code = children?.trim() ?? "";

  const highlightedLines =
    highlight?.split(",").map((line) => parseInt(line, 10)) ?? [];

  return (
    <div className={styles.wrapper}>
      <Clipboard text={code} className={styles.clipboard} />
      <div className={styles.scroll}>
        <SyntaxHighlighting
          code={code}
          language={language}
          highlightedLines={highlightedLines}
        />
      </div>
      <CodeRunner code={code} />
    </div>
  );
};
