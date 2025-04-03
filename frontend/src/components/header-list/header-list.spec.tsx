import { fireEvent, render, screen } from "@testing-library/react";
import HeaderList from ".";

describe("HeaderList", () => {
  const optionsSelect = ["Todas", "Pendentes", "Concluidas"];
  it("should render", () => {
    render(
      <HeaderList
        btnOnClick={() => {}}
        changeSelect={() => {}}
        initialValueSelect={optionsSelect[0]}
        optionsSelect={optionsSelect}
      />
    );

    const button = screen.getByRole("button", { name: "Adicionar Tarefa" });
    expect(button).toBeInTheDocument();

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(optionsSelect.length);
    options.forEach((option, index) => {
      expect(option).toHaveTextContent(optionsSelect[index]);
    });
  });

  it("Should render call onClick", () => {
    const onClick = jest.fn();
    render(
      <HeaderList
        btnOnClick={onClick}
        changeSelect={() => {}}
        initialValueSelect={optionsSelect[0]}
        optionsSelect={optionsSelect}
      />
    );

    const button = screen.getByRole("button", { name: "Adicionar Tarefa" });
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("Should render call onChange", () => {
    const onChange = jest.fn();
    render(
      <HeaderList
        btnOnClick={() => {}}
        changeSelect={onChange}
        initialValueSelect={optionsSelect[0]}
        optionsSelect={optionsSelect}
      />
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: optionsSelect[1] } });

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
