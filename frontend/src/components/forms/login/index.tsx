import BaseForm from "..";
import FormGroup from "../fields/input-form";

interface LoginFormProps {
  onClickCancel?: () => void;
  onClickRedirect?: () => void;
}

export default function LoginForm({
  onClickCancel,
  onClickRedirect,
}: LoginFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Login form submitted");
  };

  return (
    <BaseForm
      title="Login"
      onSubmit={(e) => handleSubmit(e)}
      onClickCancel={onClickCancel}
      onClickRedirect={onClickRedirect}
      textRedirect="Criar uma conta"
    >
      <FormGroup label="Email" placeholder="Insira o seu email" type="email" />
      <FormGroup label="Password" placeholder="Password" type="password" />
    </BaseForm>
  );
}
