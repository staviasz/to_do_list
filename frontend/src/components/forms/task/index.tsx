"use client";

import { Task } from "@/types/task";
import { useState } from "react";
import { FormCheck } from "react-bootstrap";
import BaseForm from "..";
import FormGroup from "../fields/input-form";

interface TaskFormProps {
  onClickCloseForm: () => void;
  task?: Task;
}

export default function TaskForm({ onClickCloseForm, task }: TaskFormProps) {
  const [checked, setChecked] = useState(task?.completed);
  const [description, setDescription] = useState(task?.description);
  const [dateOfCompletion, setDateOfCompletion] = useState(
    task?.dateOfCompletion
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Login form submitted");
    onClickCloseForm();
  };

  const closeForm = () => {
    onClickCloseForm();
  };

  const handleDanger = () => {
    closeForm();
  };

  return (
    <>
      <BaseForm
        title="Task"
        onSubmit={(e) => handleSubmit(e)}
        onClickCancel={handleDanger}
        textBtnDanger={task && "Excluir"}
        textBtnSuccess={task && "Atualizar"}
      >
        {task && (
          <span className="close-form" onClick={closeForm}>
            X
          </span>
        )}

        <FormGroup
          label="Descrição"
          placeholder="Insira a descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormGroup
          label="Data de conclusão"
          placeholder="Insira a data"
          type="date"
          value={dateOfCompletion}
          onChange={(e) => setDateOfCompletion(e.target.value)}
        />
        {task && (
          <div className="d-flex justify-content-start">
            <FormCheck
              label="Concluída"
              type="switch"
              reverse
              checked={checked}
              onChange={() => setChecked(!checked)}
            />
          </div>
        )}
      </BaseForm>
    </>
  );
}
