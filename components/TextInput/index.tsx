import { Dispatch, FC, SetStateAction } from "react";
import { TextField } from "./text-field.styles";

interface Props {
  value: string | number;
  setValue: Dispatch<SetStateAction<string | number>>;
  label: string;
  placeholder: string;
  type?: string;
}
const TextInput: FC<Props> = ({
  value,
  setValue,
  label,
  placeholder,
  type = "text",
}) => {
  return (
    <div className="d-flex align-items-center justify-content-between mb-3">
      {label}:
      <TextField
        type={type}
        className="ms-2"
        name="Event name"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default TextInput;
