import { Button, FormSelect } from "react-bootstrap";

interface HeaderListProps {
  btnOnClick: () => void;
  optionsSelect: string[];
  initialValueSelect: string;
  changeSelect: (value: string) => void;
}

export default function HeaderList({
  btnOnClick,
  optionsSelect,
  initialValueSelect,
  changeSelect,
}: HeaderListProps) {
  return (
    <div
      className="d-flex align-items-center justify-content-between p-3 position-sticky top-0 bg-white"
      style={{ zIndex: 1 }}
    >
      <Button variant="success" className="" onClick={btnOnClick}>
        Adicionar Tarefa
      </Button>
      <FormSelect
        className="w-25"
        value={initialValueSelect}
        onChange={(e) => changeSelect(e.target.value)}
      >
        {optionsSelect.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </FormSelect>
    </div>
  );
}
