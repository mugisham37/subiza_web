import type { InputHTMLAttributes, ReactNode } from "react";
import { Icon } from "../icons/Icon";
import type { IconName } from "../icons/names.generated";

type ChoiceCardProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  title: string;
  description: string;
  icon?: IconName;
  mark?: ReactNode;
};

export function ChoiceCard({
  title,
  description,
  icon,
  mark,
  id,
  ...props
}: ChoiceCardProps) {
  return (
    <label className="choice" htmlFor={id}>
      <input id={id} type="radio" {...props} />
      <span className="cbody">
        {icon ? (
          <span className="cico">
            <Icon name={icon} size={19} />
          </span>
        ) : null}
        <span>
          <h4>{title}</h4>
          <p className="cd">{description}</p>
        </span>
        <span className="cmark">{mark ?? <Icon name="check" size={12} />}</span>
      </span>
    </label>
  );
}
