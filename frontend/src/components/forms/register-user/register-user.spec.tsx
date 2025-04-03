import { act, fireEvent, render, screen } from "@testing-library/react";
import RegisterForm from ".";

jest.mock("@/services/create-user", () => ({
  createUserService: jest
    .fn()
    .mockResolvedValueOnce({
      ok: false,
      body: { message: "Email já cadastrado." },
      statusCode: 400,
    })
    .mockResolvedValue({
      ok: true,
      body: { token: "token", refreshToken: "refreshToken" },
      statusCode: 200,
    }),
}));
describe("RegisterUser", () => {
  it("should render", () => {
    render(<RegisterForm />);

    const title = screen.getByRole("heading", { name: "Cadastro" });
    const labels = document.getElementsByTagName("label");
    const inputs = document.getElementsByTagName("input");
    const paragraphRedirect = screen.getByText("Tem uma conta? Faça login");
    const buttons = screen.getAllByRole("button");

    expect(title).toBeInTheDocument();

    expect(labels).toHaveLength(3);
    expect(labels[0]).toHaveTextContent("Nome");
    expect(labels[1]).toHaveTextContent("Email");
    expect(labels[2]).toHaveTextContent("Senha");

    expect(inputs).toHaveLength(3);
    expect(inputs[0]).toHaveAttribute("placeholder", "Insira o seu nome");
    expect(inputs[1]).toHaveAttribute("placeholder", "Insira o seu email");
    expect(inputs[2]).toHaveAttribute("placeholder", "Insira a sua senha");

    expect(paragraphRedirect).toBeInTheDocument();

    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent("Cancelar");
    expect(buttons[1]).toHaveTextContent("Cadastrar");
  });

  it("Should call onClickCancel", async () => {
    const onClickCancel = jest.fn();
    render(<RegisterForm onClickCancel={onClickCancel} />);
    const button = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(button);
    expect(onClickCancel).toHaveBeenCalledTimes(1);
  });

  it("Should call onClickRedirect", async () => {
    const onClickRedirect = jest.fn();
    render(<RegisterForm onClickRedirect={onClickRedirect} />);
    const paragraph = screen.getByText("Tem uma conta? Faça login");
    fireEvent.click(paragraph);
    expect(onClickRedirect).toHaveBeenCalledTimes(1);
  });

  it("Should validate field name", async () => {
    const arrange = [
      "A-B4",
      "a~b5",
      "A~B6",
      "com número no meio 1 letra",
      "Com Número No Meio 2 Letra",
      "com caractere especial ! no final",
      "Com Caractere Especial @ No Inicio",
      "misturado com número 1 e letra",
      "MiStUrAdO cOm NúMeRo 2 E lEtRa",
      "espaço e número 3",
      "EspAçO e NúMeRo 4",
      "hífen e número -5",
      "HíFeN e NúMeRo -6",
      "tilde e número ~7",
      "TiLdE e NúMeRo ~8",
      "símbolo $ no meio",
      "SímBoLo % No MeIo",
      "acentuação ok mas número 9",
      "ACENTUAÇÃO OK MAS NÚMERO 0",
      "tudo ok mas ponto final.",
      "TUDO OK MAS VIRGULA,",
      "tudo ok mas barra /",
      "TUDO OK MAS INTERROGAÇÃO?",
      "tudo ok mas sinal de maior>",
      "TUDO OK MAS SINAL DE MENOR<",
    ];
    render(<RegisterForm />);

    const [inputName, inputEmail, inputPassword] =
      document.getElementsByTagName("input");

    const button = screen.getByRole("button", { name: "Cadastrar" });

    for (const name of arrange) {
      await act(async () => {
        fireEvent.change(inputName, { target: { value: name } });
        fireEvent.change(inputEmail, { target: { value: "test@example" } });
        fireEvent.change(inputPassword, { target: { value: "Test123" } });
        fireEvent.click(button);
      });
      expect(
        await screen.findByText(
          "O nome deve conter apenas letras, espaços e hífen."
        )
      ).toBeInTheDocument();
    }
  });
  it("Should validate email field", async () => {
    render(<RegisterForm />);
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

    const [inputName, inputEmail, inputPassword] =
      document.getElementsByTagName("input");
    const button = screen.getByRole("button", { name: "Cadastrar" });

    for (const email of arrange) {
      await act(async () => {
        fireEvent.change(inputName, { target: { value: "test" } });
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
    render(<RegisterForm />);
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

    const [inputName, inputEmail, inputPassword] =
      document.getElementsByTagName("input");
    const button = screen.getByRole("button", { name: "Cadastrar" });

    for (const password of arrange) {
      await act(async () => {
        fireEvent.change(inputName, { target: { value: "test" } });
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

  it("Should render error message of api", async () => {
    render(<RegisterForm />);
    const [inputName, inputEmail, inputPassword] =
      document.getElementsByTagName("input");
    const button = screen.getByRole("button", { name: "Cadastrar" });
    await act(async () => {
      fireEvent.change(inputName, { target: { value: "test" } });
      fireEvent.change(inputEmail, { target: { value: "test@example.com" } });
      fireEvent.change(inputPassword, { target: { value: "Test123" } });
      fireEvent.click(button);
    });
    expect(await screen.findByText("Email já cadastrado.")).toBeInTheDocument();
  });

  it("should call onClickRedirect", async () => {
    const onClickRedirect = jest.fn();
    render(<RegisterForm onClickRedirect={onClickRedirect} />);
    const [inputName, inputEmail, inputPassword] =
      document.getElementsByTagName("input");
    const button = screen.getByRole("button", { name: "Cadastrar" });
    await act(async () => {
      fireEvent.change(inputName, { target: { value: "test" } });
      fireEvent.change(inputEmail, { target: { value: "test@example.com" } });
      fireEvent.change(inputPassword, { target: { value: "Test123" } });
      fireEvent.click(button);
    });
    expect(onClickRedirect).toHaveBeenCalledTimes(1);
  });
});
