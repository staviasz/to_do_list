import { Task } from "@/types/task";
import { Card, CardBody, CardSubtitle, CardText } from "react-bootstrap";

interface TaskProps {
  onClick: (value: Task) => void;
  task: Task;
}

export default function CardTasks({ onClick, task }: TaskProps) {
  return (
    <Card
      onClick={() => onClick(task)}
      className="cursor-pointer"
      data-testid="card"
    >
      <CardBody>
        <CardSubtitle>{task.dateOfCompletion}</CardSubtitle>
        <CardText>{task.description}</CardText>
        <CardText
          className={`fs-7 ${task.completed ? "text-success" : "text-danger"}`}
        >
          Completed
        </CardText>
      </CardBody>
    </Card>
  );
}
