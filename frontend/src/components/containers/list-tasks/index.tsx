"use client";

import HeaderList from "@/components/header-list";
import { useAuth } from "@/hooks/use-auth";
import { getTasksService } from "@/services/get-tasks";
import { Task } from "@/types/task";
import { useEffect, useState } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import CardTasks from "../../card-tasks";
import TaskForm from "../../forms/task";

type OptionsSelect = "Todas" | "Pendentes" | "Concluidas";

export default function ListTasksContainer() {
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [addTask, setAddTask] = useState<boolean>(false);
  const [option, setOption] = useState<OptionsSelect>("Todas");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const { session } = useAuth();

  const onClickTask = (task: Task) => {
    setSelectedTask(task);
  };

  const onChangeOption = (
    tasks: Task[],
    option: "Todas" | "Pendentes" | "Concluidas"
  ) => {
    setOption(option);
    const tasksFiltered = tasks.filter((task) => {
      switch (option) {
        case "Pendentes":
          return !task.completed;
        case "Concluidas":
          return task.completed;
        default:
          return task;
      }
    });

    setFilteredTasks(tasksFiltered);
  };

  const formatTasks = (tasks: Task[]) => {
    return tasks.map((task) => {
      const [year, month, day] = task.dateOfCompletion.split("T")[0].split("-");
      return {
        ...task,
        dateOfCompletion: `${day}/${month}/${year}`,
      };
    });
  };

  const closeForm = async (handleTask?: boolean) => {
    setSelectedTask(undefined);
    setAddTask(false);

    if (handleTask) {
      const response = await getTasksService({
        token: session!.token,
        refreshToken: session!.refreshToken,
      });
      if (response.ok) {
        const format = formatTasks(response.body);
        setTasks(format);
        onChangeOption(format, option);
      }
    }
  };

  useEffect(() => {
    if (!session) return;
    const getTasks = async () => {
      const response = await getTasksService({
        token: session!.token,
        refreshToken: session!.refreshToken,
      });

      if (response.ok) {
        const format = formatTasks(response.body);
        setTasks(format);
        onChangeOption(format, option);
      }
    };
    getTasks();
  }, [session]);

  return (
    <>
      {(selectedTask || addTask) && (
        <TaskForm onClickCloseForm={closeForm} task={selectedTask} />
      )}
      <div className="list-group-container m-auto">
        {session?.user?.id ? (
          <>
            <HeaderList
              optionsSelect={["Todas", "Pendentes", "Concluidas"]}
              btnOnClick={() => setAddTask(true)}
              initialValueSelect={option}
              changeSelect={(value) =>
                onChangeOption(tasks, value as OptionsSelect)
              }
            ></HeaderList>
            <ListGroup className="border-0 rounded-0">
              {filteredTasks && filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <ListGroupItem className="border-0" key={task.id}>
                    <CardTasks onClick={onClickTask} task={task} />
                  </ListGroupItem>
                ))
              ) : (
                <p className="ms-3 mt-3">Nenhuma tarefa cadastrada</p>
              )}
            </ListGroup>
          </>
        ) : (
          <p className="ms-3 mt-3">Faça login para ver as tarefas</p>
        )}
      </div>
    </>
  );
}
