import { Task } from "@/types/task";
import { Card, CardBody, CardSubtitle, CardText } from "react-bootstrap";

interface TaskProps {
  onClick: (value: Task) => void;
  task: Task;
}

export default function CardTasks({ onClick, task }: TaskProps) {
  return (
    <Card onClick={() => onClick(task)} className="cursor-pointer">
      <CardBody>
        <CardSubtitle>{task.dateOfCompletion}</CardSubtitle>
        <CardText>{task.description}</CardText>
        <CardText>Motivacional</CardText>
      </CardBody>
    </Card>
  );
}
