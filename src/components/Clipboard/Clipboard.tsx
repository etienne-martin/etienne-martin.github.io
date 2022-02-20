import React, {
  ButtonHTMLAttributes,
  FC,
  useEffect,
  useRef,
  useState,
} from "react";
import classnames from "classnames";
import { CopyIcon } from "../../icons/Copy";
import { styles } from "./Clipboard.style";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

interface ClipboardProps extends ButtonProps {
  text: string;
}

export const Clipboard: FC<ClipboardProps> = ({
  text,
  className,
  ...otherProps
}) => {
  const confirmationTimeoutIdRef = useRef(0);
  const [shouldShowConfirmation, setShouldShowConfirmation] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(text);
    setShouldShowConfirmation(true);

    confirmationTimeoutIdRef.current = window.setTimeout(() => {
      setShouldShowConfirmation(false);
    }, 500);
  };

  useEffect(
    () => () => {
      clearTimeout(confirmationTimeoutIdRef.current);
    },
    []
  );

  return (
    <button
      aria-label="Copy text to clipboard"
      className={classnames(styles.button, className)}
      {...otherProps}
      onClick={copyToClipboard}
    >
      <span
        aria-hidden
        className={classnames(styles.confirmation, {
          [styles.shouldShowConfirmation]: shouldShowConfirmation,
        })}
      >
        Copied ✨
      </span>
      <span className={styles.tapSurface}>
        <CopyIcon />
      </span>
    </button>
  );
};
