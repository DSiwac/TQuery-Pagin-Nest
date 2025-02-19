import cn from "classnames";
import { ButtonProps } from "./Button.props";
import styles from "./Button.module.css";

function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(styles["button"], styles["acc"], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
