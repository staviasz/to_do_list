"use client";

import { createUserService } from "@/services/create-user";
import { useState } from "react";
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
  const fieldsForm = {
    name: "",
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(fieldsForm);
  const [errorMessages, setErrorMessages] = useState(fieldsForm);
  const [errorApi, setErrorApi] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const erros = JSON.parse(JSON.stringify(fieldsForm));

    if (!/^[a-zA-ZÀ-ÿ\s~-]+$/.test(formData.name)) {
      erros.name = "O nome deve conter apenas letras, espaços e hífen.";
    }

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

    if (erros.name || erros.email || erros.password) {
      return;
    }

    const response = await createUserService(formData);
    if (!response.ok) {
      setErrorApi(response.body.message);
      return;
    }
    onClickRedirect?.();
  };

  return (
    <BaseForm
      onSubmit={(e) => handleSubmit(e)}
      title="Cadastro"
      onClickCancel={onClickCancel}
      onClickRedirect={onClickRedirect}
      textRedirect="Tem uma conta? Faça login"
      messageErroApi={errorApi}
      textBtnSuccess="Cadastrar"
    >
      <FormGroup
        label="Nome"
        placeholder="Insira o seu nome"
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        value={formData.name}
        messageError={errorMessages.name}
      />
      <FormGroup
        label="Email"
        placeholder="Insira o seu email"
        type="email"
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        value={formData.email}
        messageError={errorMessages.email}
      />
      <FormGroup
        label="Senha"
        placeholder="Insira a sua senha"
        type="password"
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        value={formData.password}
        messageError={errorMessages.password}
      />
    </BaseForm>
  );
}
