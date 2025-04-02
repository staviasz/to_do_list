"use client";

import { useAuth } from "@/hooks/use-auth";
import { createTaskService } from "@/services/create-task";
import { deleteTaskService } from "@/services/delete-task";
import { updateTaskService } from "@/services/update-task";
import { Task } from "@/types/task";
import { useState } from "react";
import { FormCheck } from "react-bootstrap";
import BaseForm from "..";
import FormGroup from "../fields/input-form";

interface TaskFormProps {
  onClickCloseForm: (handleTask?: boolean) => void;
  task?: Task;
}

export default function TaskForm({ onClickCloseForm, task }: TaskFormProps) {
  const { session } = useAuth();
  const [errorApi, setErrorApi] = useState("");

  const fieldsForm = {
    description: "",
    dateOfCompletion: "",
    completed: false,
  };
  const formateDate = (date?: string) => {
    if (!date) return;
    const [day, month, year] = date.split("T")[0].split("/");
    return `${year}-${month}-${day}`;
  };
  const [formData, setFormData] = useState({
    description: task?.description || fieldsForm.description,
    dateOfCompletion:
      formateDate(task?.dateOfCompletion) || fieldsForm.dateOfCompletion,
    completed: task?.completed || fieldsForm.completed,
  });
  const [errorMessages, setErrorMessages] = useState(fieldsForm);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const erros = structuredClone(fieldsForm);

    const descriptionLength = formData.description?.length;
    if (descriptionLength < 3 || descriptionLength > 255) {
      erros.description = "A descrição deve ter entre 3 e 255 caracteres.";
    }

    const dateIsValid = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(
      formData.dateOfCompletion
    );

    if (!dateIsValid) {
      erros.dateOfCompletion =
        "A data de conclusão deve ser no formato mm/dd/aaaa.";
    }

    if (dateIsValid) {
      const [year, month, day] = formData.dateOfCompletion
        .split("-")
        .map(Number);
      const date = new Date(year, month - 1, day);
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      if (+date < +now) {
        erros.dateOfCompletion =
          "A data de conclusão deve ser uma data futura.";
      }
    }

    setErrorMessages(erros);

    if (erros.description || erros.dateOfCompletion) {
      return;
    }

    let response;
    switch (task) {
      case undefined:
        response = await createTaskService({
          body: formData,
          token: session!.token,
          refreshToken: session!.refreshToken,
        });
        break;

      default:
        response = await updateTaskService({
          body: formData,
          token: session!.token,
          id: task.id as number,
          refreshToken: session!.refreshToken,
        });
        break;
    }

    if (!response.ok) {
      setErrorApi(response.body.message);
      return;
    }

    onClickCloseForm(true);
  };

  const handleCancel = async () => {
    if (task) {
      const response = await deleteTaskService({
        id: task.id as number,
        token: session!.token,
        refreshToken: session!.refreshToken,
      });
      if (!response.ok) {
        setErrorApi(response.body.message);
        return;
      }
      onClickCloseForm(true);
    }

    onClickCloseForm();
  };

  return (
    <>
      <BaseForm
        title="Task"
        onSubmit={(e) => handleSubmit(e)}
        onClickCancel={handleCancel}
        textBtnDanger={task && "Excluir"}
        textBtnSuccess={task && "Atualizar"}
        messageErroApi={errorApi}
      >
        {task && (
          <span className="close-form" onClick={() => onClickCloseForm()}>
            X
          </span>
        )}

        <FormGroup
          label="Descrição"
          placeholder="Insira a descrição"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          messageError={errorMessages.description}
        />
        <FormGroup
          label="Data de conclusão"
          placeholder="Insira a data"
          type="date"
          value={formData.dateOfCompletion}
          onChange={(e) =>
            setFormData({ ...formData, dateOfCompletion: e.target.value })
          }
          messageError={errorMessages.dateOfCompletion}
        />
        {task && (
          <div className="d-flex justify-content-start">
            <FormCheck
              label="Concluída"
              type="switch"
              reverse
              checked={formData.completed}
              onChange={() => {
                setFormData({
                  ...formData,
                  completed: !formData.completed,
                });
              }}
            />
          </div>
        )}
      </BaseForm>
    </>
  );
}
