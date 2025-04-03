import { useAuthMock } from "@/mocks/use-session-context-mock";
import { render, screen, waitFor } from "@testing-library/react";
import HomeContainer from ".";

jest.mock("@/hooks/use-auth", () => ({
  useAuth: useAuthMock,
}));

jest.mock("@/services/get-tasks", () => ({
  getTasksService: jest
    .fn()
    .mockResolvedValue({ ok: true, body: [], statusCode: 200 }),
}));

describe("Home", () => {
  it("should render without user", () => {
    render(<HomeContainer />);

    const accessText = screen.getByText("Acessar");
    const paragraph = screen.getByText("Faça login para ver as tarefas");
    const image = screen.getByAltText("Usuário não logado");

    expect(accessText).toBeInTheDocument();
    expect(paragraph).toBeInTheDocument();
    expect(image).toBeInTheDocument();
  });

  it("should render with user", async () => {
    useAuthMock.mockReturnValue({ session: { user: { id: 1 } } });
    render(<HomeContainer />);

    const accessText = screen.getByText("Acessar");
    const image = screen.getByAltText("Usuário logado");
    const buttonAddNewTask = screen.getByRole("button", {
      name: "Adicionar Tarefa",
    });
    const select = screen.getByRole("combobox");
    const paragraph = screen.getByText("Nenhuma tarefa cadastrada");

    await waitFor(() => {
      expect(accessText).toBeInTheDocument();
      expect(image).toBeInTheDocument();
      expect(buttonAddNewTask).toBeInTheDocument();
      expect(select).toBeInTheDocument();
      expect(paragraph).toBeInTheDocument();
    });
  });
});
