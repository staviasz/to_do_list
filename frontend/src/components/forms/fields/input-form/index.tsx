import Form from "react-bootstrap/esm/Form";

interface FormGroupProps {
  label: string;
  type?: "email" | "password" | "text" | "date" | "checkbox";
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

export default function FormGroup({
  label,
  placeholder,
  type = "text",
  onChange,
  value,
}: FormGroupProps) {
  return (
    <div className="mb-3 form-group">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
