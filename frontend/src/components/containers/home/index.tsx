"use client";

import ListTasks from "@/components/containers/list-tasks";
import LoginForm from "@/components/forms/login";
import RegisterForm from "@/components/forms/register-user";
import Header from "@/components/header";
import { useState } from "react";

export default function HomeContainer() {
  const [showForm, setShowForm] = useState<"login" | "register" | null>(null);

  return (
    <>
      <Header onClick={() => setShowForm("login")} />
      <ListTasks />
      {showForm === "login" && (
        <LoginForm
          onClickCancel={() => setShowForm(null)}
          onClickRedirect={() => setShowForm("register")}
        />
      )}
      {showForm === "register" && (
        <RegisterForm
          onClickCancel={() => setShowForm(null)}
          onClickRedirect={() => setShowForm("login")}
        />
      )}
    </>
  );
}
