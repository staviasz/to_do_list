import { render, screen } from "@testing-library/react";
import Header from ".";

describe("Header", () => {
  it("should render", () => {
    render(<Header onClick={() => {}} />);

    const paragraph = screen.getByRole("paragraph");
    const image = screen.getByRole("img");

    expect(image).toBeInTheDocument();
    expect(paragraph).toHaveTextContent("Acessar");
  });

  it("Should render call onClick", () => {
    const onClick = jest.fn();
    render(<Header onClick={onClick} />);

    const paragraph = screen.getByRole("paragraph");
    paragraph.click();

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
