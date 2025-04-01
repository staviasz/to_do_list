"use client";

import { Task } from "@/types/task";
import { useState } from "react";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import CardTasks from "../../card-tasks";
import TaskForm from "../../forms/task";

const tasks: Task[] = [
  // {
  //   id: 1,
  //   description: "Task 1",
  //   completed: false,
  //   dateOfCompletion: "2026-06-01",
  // },
  // {
  //   id: 2,
  //   description: "Task 2",
  //   completed: false,
  //   dateOfCompletion: "2026-06-01",
  // },
  // {
  //   id: 3,
  //   description: "Task 3",
  //   completed: false,
  //   dateOfCompletion: "2026-06-01",
  // },
];

export default function ListTasksContainer() {
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [addTask, setAddTask] = useState<boolean>(false);

  const onClickTask = (task: Task) => {
    setSelectedTask(task);
  };

  const closeForm = () => {
    setSelectedTask(undefined);
    setAddTask(false);
  };

  return (
    <>
      {(selectedTask || addTask) && (
        <TaskForm onClickCloseForm={closeForm} task={selectedTask} />
      )}
      <div className="list-group-container m-auto">
        <Button
          variant="success ms-3"
          className="mt-2"
          onClick={() => setAddTask(true)}
        >
          Adicionar Tarefa
        </Button>
        <ListGroup className="border-0 rounded-0">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <ListGroupItem className="border-0" key={task.id}>
                <CardTasks onClick={onClickTask} task={task} />
              </ListGroupItem>
            ))
          ) : (
            <p className="ms-3 mt-3">Nenhuma tarefa cadastrada</p>
          )}
        </ListGroup>
      </div>
    </>
  );
}
