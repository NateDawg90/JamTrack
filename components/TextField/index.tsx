import { TextField } from "./text-field.styles";

interface Props {
  value: string;
  setValue: (value: string) => void;
  label: string;
  placeholder: string;
}
const TextInput = ({ value, setValue, label, placeholder }) => {
  return (
    <div className="d-flex align-items-center justify-content-between mb-4">
      {label}:
      <TextField
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
