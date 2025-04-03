import { useAuthMock } from "@/mocks/use-session-context-mock";
import { act, fireEvent, render, screen } from "@testing-library/react";
import LoginForm from ".";

jest.mock("@/services/login-user", () => ({
  loginUserService: jest
    .fn()
    .mockResolvedValueOnce({
      ok: false,
      body: { message: "Email ou senha incorretos." },
      statusCode: 400,
    })
    .mockResolvedValue({
      ok: true,
      body: { token: "token", refreshToken: "refreshToken" },
      statusCode: 200,
    }),
}));

jest.mock("@/hooks/use-auth", () => ({
  useAuth: useAuthMock,
}));

beforeEach(() => {
  useAuthMock.mockClear();
  jest.clearAllMocks();
});

describe("LoginForm", () => {
  it("should render", () => {
    render(<LoginForm />);
    const title = screen.getByRole("heading", { name: "Login" });
    const emails = document.getElementsByTagName("label");
    const inputs = document.getElementsByTagName("input");
    const redirect = screen.getByRole("paragraph");
    const buttons = screen.getAllByRole("button");

    expect(title).toBeInTheDocument();
    expect(emails).toHaveLength(2);
    expect(inputs).toHaveLength(2);

    expect(emails[0]).toHaveTextContent("Email");
    expect(emails[1]).toHaveTextContent("Senha");

    expect(inputs[0]).toHaveAttribute("placeholder", "Insira o seu email");
    expect(inputs[1]).toHaveAttribute("placeholder", "Insira a sua senha");

    expect(redirect).toHaveTextContent("Criar uma conta?");

    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent("Cancelar");
    expect(buttons[1]).toHaveTextContent("Entrar");
  });

  it("Should validate email field", async () => {
    render(<LoginForm />);
    const arrange = [
      [
        "plainaddress",
        "#@%^%#$@#$@#.com",
        "@example.com",
        "Joe Smith <email@example.com>",
        "email.example.com",
        "email@example@example.com",
        ".email@example.com",
        "email.@example.com",
        "email..email@example.com",
        "あいうえお@example.com",
        "email@example.com (Joe Smith)",
        "email@-example.com",
        "email@111.222.333.44444",
        "email@example..com",
        "email@example",
        "email@example.com.",
        "email@example.com-",
        "email@example.c",
        "email@example..com",
        "invalid",
        "",
      ],
    ];

    const [inputEmail, inputPassword] = document.getElementsByTagName("input");
    const button = screen.getByRole("button", { name: "Entrar" });

    for (const email of arrange) {
      await act(async () => {
        fireEvent.change(inputEmail, { target: { value: email } });
        fireEvent.change(inputPassword, { target: { value: "Test123" } });
        fireEvent.click(button);
      });

      expect(
        await screen.findByText("O email deve ser um email válido.")
      ).toBeInTheDocument();
    }
  });
  it("Should validate password field", async () => {
    render(<LoginForm />);
    const arrange = [
      "",
      "a",
      "A",
      "1",
      "aa",
      "AA",
      "11",
      "aA",
      "a1",
      "A1",
      "aaa",
      "AAA",
      "111",
      "aAa",
      "a1a",
      "A1A",
      "1a1",
      "AA11",
      "aa11",
      "letras",
      "MAIUSCULAS",
      "numeros",
      "letrasminusculas",
      "LETRASMAIUSCULAS",
      "numerosnumeros",
      "letraEMaiuscula",
      "soLetrasMinusculas",
      "SoLetrasMaiusculas",
      "SoNumeros",
      "misturaSemNumero",
      "misturaSemMaiuscula",
      "misturaSemMinuscula",
      "comEspaco no meio",
      "comEspaco no final ",
      " comEspaco no inicio",
      "!@#$%¨&*()_+",
      "caracteresespeciais",
      "a!",
      "A@",
      "1#",
      "aA$",
      "a1%",
      "A1^",
    ];

    const [inputEmail, inputPassword] = document.getElementsByTagName("input");
    const button = screen.getByRole("button", { name: "Entrar" });

    for (const password of arrange) {
      await act(async () => {
        fireEvent.change(inputEmail, { target: { value: "test@example.com" } });
        fireEvent.change(inputPassword, { target: { value: password } });
        fireEvent.click(button);
      });
      expect(
        await screen.findByText(
          "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número."
        )
      ).toBeInTheDocument();
    }
  });

  it("Should call onClickCancel", async () => {
    const onCancel = jest.fn();
    render(<LoginForm onClickCancel={onCancel} />);
    const button = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(button);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("Should call onClickRedirect", async () => {
    const onClickRedirect = jest.fn();
    render(<LoginForm onClickRedirect={onClickRedirect} />);
    const paragraph = screen.getByText("Criar uma conta?");
    fireEvent.click(paragraph);
    expect(onClickRedirect).toHaveBeenCalledTimes(1);
  });

  it("Should render error message of api", async () => {
    render(<LoginForm />);
    const [inputEmail, inputPassword] = document.getElementsByTagName("input");
    const button = screen.getByRole("button", { name: "Entrar" });
    await act(async () => {
      fireEvent.change(inputEmail, { target: { value: "test@example.com" } });
      fireEvent.change(inputPassword, { target: { value: "Test123" } });
      fireEvent.click(button);
    });
    expect(
      await screen.findByText("Email ou senha incorretos.")
    ).toBeInTheDocument();
  });

  it("Should call setSession and onClickCancel on submit", async () => {
    const onClickCancel = jest.fn();
    useAuthMock.mockReturnValue({ setSession: jest.fn() });
    render(<LoginForm onClickCancel={onClickCancel} />);

    const [inputEmail, inputPassword] = document.getElementsByTagName("input");
    const button = screen.getByRole("button", { name: "Entrar" });

    await act(async () => {
      fireEvent.change(inputEmail, { target: { value: "test@example.com" } });
      fireEvent.change(inputPassword, { target: { value: "Test123" } });
      fireEvent.click(button);
    });

    expect(useAuthMock().setSession).toHaveBeenCalledTimes(1);
    expect(onClickCancel).toHaveBeenCalledTimes(1);
  });
});
