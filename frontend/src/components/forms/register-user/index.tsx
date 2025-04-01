import BaseForm from "..";
import FormGroup from "../fields/input-form";

interface RegisterFormProps {
  onClickCancel?: () => void;
  onClickRedirect?: () => void;
}

export default function RegisterForm({
  onClickCancel,
  onClickRedirect,
}: RegisterFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Login form submitted");
  };

  return (
    <BaseForm
      onSubmit={(e) => handleSubmit(e)}
      title="Register"
      onClickCancel={onClickCancel}
      onClickRedirect={onClickRedirect}
      textRedirect="Tem uma conta? Faça login"
    >
      <FormGroup label="Nome" placeholder="Insira o seu nome" />
      <FormGroup label="Email" placeholder="Insira o seu email" type="email" />
      <FormGroup
        label="Senha"
        placeholder="Insira a sua senha"
        type="password"
      />
    </BaseForm>
  );
}
