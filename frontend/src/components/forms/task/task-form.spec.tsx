import {
  createTaskMock,
  deleteTaskMock,
  updateTaskMock,
} from "@/mocks/services";
import { tasksMock } from "@/mocks/tasks-mock";
import { useAuthMock } from "@/mocks/use-session-context-mock";
import { act, fireEvent, render, screen } from "@testing-library/react";
import TaskForm from ".";

jest.mock("@/services/create-task", () => ({
  createTaskService: createTaskMock,
}));

jest.mock("@/services/update-task", () => ({
  updateTaskService: updateTaskMock,
}));

jest.mock("@/services/delete-task", () => ({
  deleteTaskService: deleteTaskMock,
}));
jest.mock("@/hooks/use-auth", () => ({
  useAuth: useAuthMock,
}));

describe("TaskForm", () => {
  it("should render form to create task", () => {
    render(<TaskForm onClickCloseForm={() => {}} />);

    const title = screen.getByRole("heading", { name: "Task" });
    const labels = document.getElementsByTagName("label");
    const inputs = document.getElementsByTagName("input");
    const buttons = screen.getAllByRole("button");

    expect(title).toBeInTheDocument();

    expect(labels).toHaveLength(2);
    expect(labels[0]).toHaveTextContent("Descrição");
    expect(labels[1]).toHaveTextContent("Data de conclusão");

    expect(inputs).toHaveLength(2);
    expect(inputs[0]).toHaveAttribute("placeholder", "Insira a descrição");
    expect(inputs[1]).toHaveAttribute("type", "date");

    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent("Cancelar");
    expect(buttons[1]).toHaveTextContent("Salvar");
  });

  it("Should render form to update task", () => {
    render(<TaskForm onClickCloseForm={() => {}} task={tasksMock[0]} />);

    const title = screen.getByRole("heading", { name: "Task" });
    const labels = document.getElementsByTagName("label");
    const inputs = document.getElementsByTagName("input");
    const buttons = screen.getAllByRole("button");

    expect(title).toBeInTheDocument();

    expect(labels).toHaveLength(3);
    expect(labels[0]).toHaveTextContent("Descrição");
    expect(labels[1]).toHaveTextContent("Data de conclusão");
    expect(labels[2]).toHaveTextContent("Concluída");

    expect(inputs).toHaveLength(3);
    expect(inputs[0]).toHaveAttribute("placeholder", "Insira a descrição");
    expect(inputs[1]).toHaveAttribute("type", "date");
    expect(inputs[2]).toHaveAttribute("type", "checkbox");

    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent("Excluir");
    expect(buttons[1]).toHaveTextContent("Atualizar");
  });

  it("Should validate description field", async () => {
    const arrange = ["", "a", "A".repeat(256)];

    render(<TaskForm onClickCloseForm={() => {}} />);

    const [inputDescription, inputDate] =
      document.getElementsByTagName("input");
    const button = screen.getByRole("button", { name: "Salvar" });

    for (const description of arrange) {
      await act(async () => {
        fireEvent.change(inputDescription, { target: { value: description } });
        fireEvent.change(inputDate, { target: { value: "2026-01-01" } });
        fireEvent.click(button);
      });
      expect(
        await screen.findByText(
          "A descrição deve ter entre 3 e 255 caracteres."
        )
      ).toBeInTheDocument();
    }
  });

  it("Should validate format date field", async () => {
    const arrange = [
      "",
      "2023",
      "23-10-05",
      "2023-10",
      "20231005",
      "2023-1-05",
      "2023-10-5",
      "2023-10-05-",
      "-2023-10-05",
      "aaaa-bb-cc",
      "2023/10/05",
      "2023 10 05",
      "2023.10.05",
      "202310-05",
      "2023-1005",
      "2023--10-05",
      "2023-10--05",
      "2023-10-055",
      "20233-10-05",
      "2023 - 10 - 05",
      "2023 -10- 05",
      "2023- 10 -05",
      "2023-10 - 05",
      "2023 - 10-05",
      "2023-10-05 ",
      " 2023-10-05",
      "2023-10-05a",
      "a2023-10-05",
      "2023-OCT-05",
      "23-10-05",
      "2023-10-5",
      "2023-1-05",
      "0000-00-00",
      "9999-99-99",
      "2023-13-05",
      "2023-10-32",
      "2023-00-05",
      "2023-10-00",
    ];

    render(<TaskForm onClickCloseForm={() => {}} />);

    const [inputDescription, inputDate] =
      document.getElementsByTagName("input");
    const button = screen.getByRole("button", { name: "Salvar" });

    for (const date of arrange) {
      await act(async () => {
        fireEvent.change(inputDescription, { target: { value: "test" } });
        fireEvent.change(inputDate, { target: { value: date } });
        fireEvent.click(button);
      });
      expect(
        await screen.findByText(
          "A data de conclusão deve ser no formato mm/dd/aaaa."
        )
      ).toBeInTheDocument();
    }
  });

  it("Should validate date field is has future date", async () => {
    render(<TaskForm onClickCloseForm={() => {}} />);

    const [inputDescription, inputDate] =
      document.getElementsByTagName("input");
    const button = screen.getByRole("button", { name: "Salvar" });

    await act(async () => {
      fireEvent.change(inputDescription, { target: { value: "test" } });
      fireEvent.change(inputDate, { target: { value: "2020-01-01" } });
      fireEvent.click(button);
    });

    expect(
      await screen.findByText("A data de conclusão deve ser uma data futura.")
    ).toBeInTheDocument();
  });

  it("Should render error message when create task", async () => {
    useAuthMock.mockReturnValue({
      session: {
        token: "any_token",
        refreshToken: "any_refresh_token",
      },
    });
    createTaskMock.mockResolvedValueOnce({
      ok: false,
      body: { message: "any_error" },
      statusCode: 400,
    });
    render(<TaskForm onClickCloseForm={() => {}} />);

    const [inputDescription, inputDate] =
      document.getElementsByTagName("input");
    const button = screen.getByRole("button", { name: "Salvar" });

    await act(async () => {
      fireEvent.change(inputDescription, { target: { value: "test" } });
      fireEvent.change(inputDate, { target: { value: "2026-01-01" } });
      fireEvent.click(button);
    });

    expect(createTaskMock).toHaveBeenCalledTimes(1);
    expect(await screen.findByText("any_error")).toBeInTheDocument();
  });

  it("Should render error message when update task", async () => {
    useAuthMock.mockReturnValue({
      session: {
        token: "any_token",
        refreshToken: "any_refresh_token",
      },
    });
    updateTaskMock.mockResolvedValueOnce({
      ok: false,
      body: { message: "any_error" },
      statusCode: 400,
    });
    render(<TaskForm onClickCloseForm={() => {}} task={tasksMock[0]} />);

    const [inputDescription, inputDate] =
      document.getElementsByTagName("input");
    const button = screen.getByRole("button", { name: "Atualizar" });

    await act(async () => {
      fireEvent.change(inputDescription, { target: { value: "test" } });
      fireEvent.change(inputDate, { target: { value: "2026-01-01" } });
      fireEvent.click(button);
    });

    expect(updateTaskMock).toHaveBeenCalledTimes(1);
    expect(await screen.findByText("any_error")).toBeInTheDocument();
  });

  it("Should call onClickCloseForm on success", async () => {
    useAuthMock.mockReturnValue({
      session: {
        token: "any_token",
        refreshToken: "any_refresh_token",
      },
    });
    createTaskMock.mockResolvedValueOnce({
      ok: true,
      body: { message: "Task created successfully" },
      statusCode: 201,
    });
    const onClickCloseForm = jest.fn();
    render(<TaskForm onClickCloseForm={onClickCloseForm} />);

    const [inputDescription, inputDate] =
      document.getElementsByTagName("input");
    const button = screen.getByRole("button", { name: "Salvar" });

    await act(async () => {
      fireEvent.change(inputDescription, { target: { value: "test" } });
      fireEvent.change(inputDate, { target: { value: "2026-01-01" } });
      fireEvent.click(button);
    });

    expect(createTaskMock).toHaveBeenCalledTimes(1);
    expect(onClickCloseForm).toHaveBeenCalledWith(true);
  });

  it("Should call deleteTask and onClickCloseForm", async () => {
    useAuthMock.mockReturnValue({
      session: {
        token: "any_token",
        refreshToken: "any_refresh_token",
      },
    });
    deleteTaskMock.mockResolvedValueOnce({
      ok: true,
      body: { message: "Task deleted successfully" },
      statusCode: 200,
    });
    const onClickCloseForm = jest.fn();
    render(
      <TaskForm onClickCloseForm={onClickCloseForm} task={tasksMock[0]} />
    );

    const button = screen.getByRole("button", { name: "Excluir" });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(deleteTaskMock).toHaveBeenCalledTimes(1);
    expect(onClickCloseForm).toHaveBeenCalledWith(true);
  });
});
