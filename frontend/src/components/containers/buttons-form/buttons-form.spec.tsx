import { fireEvent, render, screen } from "@testing-library/react";
import ContainerButtonsForm from ".";

describe("ButtonsForm", () => {
  it("should render with default props", () => {
    render(<ContainerButtonsForm />);

    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent("Cancelar");
    expect(buttons[1]).toHaveTextContent("Salvar");
  });

  it("Should render with custom props", () => {
    render(
      <ContainerButtonsForm textDangerBtn="Danger" textSuccessBtn="Success" />
    );
    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent("Danger");
    expect(buttons[1]).toHaveTextContent("Success");
  });

  it("Should call onClickCancel", async () => {
    const onClickCancel = jest.fn();
    render(<ContainerButtonsForm onClickDanger={onClickCancel} />);
    const button = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(button);
    expect(onClickCancel).toHaveBeenCalledTimes(1);
  });

  it("Should call onClickSuccess", async () => {
    const onClickSuccess = jest.fn();
    render(<ContainerButtonsForm onClickSuccess={onClickSuccess} />);
    const button = screen.getByRole("button", { name: "Salvar" });
    fireEvent.click(button);
    expect(onClickSuccess).toHaveBeenCalledTimes(1);
  });
});
