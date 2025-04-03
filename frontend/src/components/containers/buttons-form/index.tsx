import Button from "react-bootstrap/Button";

interface ContainerButtonsFormProps {
  textDangerBtn?: string;
  onClickDanger?: () => void;
  onClickSuccess?: () => void;
  textSuccessBtn?: string;
}

export default function ContainerButtonsForm({
  textDangerBtn = "Cancelar",
  textSuccessBtn = "Salvar",
  onClickDanger,
  onClickSuccess,
}: ContainerButtonsFormProps) {
  return (
    <div className="d-flex justify-content-end">
      <Button
        variant="danger"
        type="reset"
        className="me-2"
        onClick={onClickDanger}
      >
        {textDangerBtn}
      </Button>
      <Button variant="success" type="submit" onClick={onClickSuccess}>
        {textSuccessBtn}
      </Button>
    </div>
  );
}
