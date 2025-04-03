import { Task } from "@/types/task";
import { fireEvent, render, screen } from "@testing-library/react";
import CardTasks from ".";

describe("CardTasks", () => {
  const task: Task = {
    id: 1,
    description: "Task 1",
    dateOfCompletion: "2022-01-01",
    completed: false,
  };
  it("should render", () => {
    render(<CardTasks onClick={() => {}} task={task} />);
    const date = screen.getByText(task.dateOfCompletion);
    const description = screen.getByText(task.description);

    expect(date).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it("Should render call onClick", () => {
    const onClick = jest.fn();
    render(<CardTasks onClick={onClick} task={task} />);

    const card = screen.getByTestId("card");
    fireEvent.click(card);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
