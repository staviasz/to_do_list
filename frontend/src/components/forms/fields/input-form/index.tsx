import Form from "react-bootstrap/esm/Form";

interface FormGroupProps {
  label: string;
  messageError: string;
  type?: "email" | "password" | "text" | "date" | "checkbox";
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  required?: boolean;
}

export default function FormGroup({
  label,
  placeholder,
  type = "text",
  onChange,
  value,
  required = false,
  messageError,
}: FormGroupProps) {
  return (
    <div className="mb-3 form-group">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        isInvalid={!!messageError}
      />
      <Form.Control.Feedback type="invalid">
        {messageError}
      </Form.Control.Feedback>
    </div>
  );
}
