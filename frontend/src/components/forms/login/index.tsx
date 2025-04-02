"use client";

import { useAuth } from "@/hooks/use-auth";
import { loginUserService } from "@/services/login-user";
import { useState } from "react";
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
  const fieldsForm = {
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(fieldsForm);
  const [errorMessages, setErrorMessages] = useState(fieldsForm);
  const [errorApi, setErrorApi] = useState("");
  const session = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const erros = structuredClone(fieldsForm);

    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      erros.email = "O email deve ser um email válido.";
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{1,}$/.test(formData.password)
    ) {
      erros.password =
        "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número.";
    }

    setErrorMessages(erros);
    if (erros.email || erros.password) {
      return;
    }

    const response = await loginUserService(formData);
    if (response.status > 299) {
      setErrorApi(response.body.message);
      return;
    }

    window.localStorage.setItem("token", response.body.token);
    window.localStorage.setItem("refreshToken", response.body.refreshToken);
    session.setSession({
      token: response.body.token,
      refreshToken: response.body.refreshToken,
    });
    onClickCancel?.();
  };

  return (
    <BaseForm
      title="Login"
      onSubmit={(e) => handleSubmit(e)}
      onClickCancel={onClickCancel}
      onClickRedirect={onClickRedirect}
      textRedirect="Criar uma conta"
      messageErroApi={errorApi}
    >
      <FormGroup
        label="Email"
        placeholder="Insira o seu email"
        type="email"
        messageError={errorMessages.email}
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <FormGroup
        label="Password"
        placeholder="Password"
        type="password"
        messageError={errorMessages.password}
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
    </BaseForm>
  );
}
