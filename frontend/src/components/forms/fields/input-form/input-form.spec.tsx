import { fireEvent, render, screen } from "@testing-library/react";
import FormGroup from ".";

describe("InputForm", () => {
  it("should render", () => {
    render(<FormGroup label="jest" messageError="jest error" />);
    const label = screen.getByText("jest");
    const input = screen.getByRole("textbox");
    const error = screen.getByText("jest error");

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(error).toBeInTheDocument();
  });

  it("Should render call onChange", () => {
    const onChange = jest.fn();
    render(<FormGroup label="jest" onChange={onChange} messageError={""} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "jest" } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
