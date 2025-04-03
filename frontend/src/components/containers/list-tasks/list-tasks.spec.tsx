import { tasksMock } from "@/mocks/tasks-mock";
import { useAuthMock } from "@/mocks/use-session-context-mock";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import ListTasksContainer from ".";

jest.mock("@/hooks/use-auth", () => ({
  useAuth: useAuthMock,
}));
jest.mock("@/services/get-tasks", () => ({
  getTasksService: jest
    .fn()
    .mockResolvedValue({ ok: true, body: tasksMock, statusCode: 200 }),
}));

describe("ListTasks", () => {
  it("should render without user", () => {
    render(<ListTasksContainer />);

    const paragraph = screen.getByText("Faça login para ver as tarefas");

    expect(paragraph).toBeInTheDocument();
  });

  it("should render with user", async () => {
    useAuthMock.mockReturnValue({ session: { user: { id: 1 } } });
    render(<ListTasksContainer />);

    const buttonAddNewTask = screen.getByRole("button", {
      name: "Adicionar Tarefa",
    });
    const select = screen.getByRole("combobox");
    const paragraph = screen.getByText("Nenhuma tarefa cadastrada");

    await waitFor(() => {
      expect(buttonAddNewTask).toBeInTheDocument();
      expect(select).toBeInTheDocument();
      expect(paragraph).toBeInTheDocument();
    });
  });

  it("Should open modal form task on click on add button", async () => {
    useAuthMock.mockReturnValue({ session: { user: { id: 1 } } });
    render(<ListTasksContainer />);

    const buttonAddNewTask = screen.getByRole("button", {
      name: "Adicionar Tarefa",
    });

    await act(async () => {
      fireEvent.click(buttonAddNewTask);
    });

    const form = await screen.findByTestId("task-form");
    expect(form).toBeInTheDocument();
  });

  it("Should open modal form task on click on card", async () => {
    useAuthMock.mockReturnValue({ session: { user: { id: 1 } } });
    render(<ListTasksContainer />);

    const card = await screen.findAllByTestId("card");

    await act(async () => {
      fireEvent.click(card[0]);
    });

    const form = await screen.findByTestId("task-form");
    expect(form).toBeInTheDocument();
  });

  it("Should filter tasks", async () => {
    useAuthMock.mockReturnValue({ session: { user: { id: 1 } } });
    const allTasks = tasksMock;
    const pendingTasks = tasksMock.filter((task) => task.completed === false);
    const completedTasks = tasksMock.filter((task) => task.completed === true);

    render(<ListTasksContainer />);

    const select = screen.getByRole("combobox");
    await act(async () => {
      fireEvent.change(select, { target: { value: "Todas" } });
    });

    const cards = await screen.findAllByTestId("card");
    expect(cards).toHaveLength(allTasks.length);

    await act(async () => {
      fireEvent.change(select, { target: { value: "Pendentes" } });
    });

    const cardsPending = await screen.findAllByTestId("card");
    expect(cardsPending).toHaveLength(pendingTasks.length);

    await act(async () => {
      fireEvent.change(select, { target: { value: "Concluidas" } });
    });

    const cardsCompleted = await screen.findAllByTestId("card");
    expect(cardsCompleted).toHaveLength(completedTasks.length);
  });
});
