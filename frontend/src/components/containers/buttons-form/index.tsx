import Button from "react-bootstrap/esm/Button";

interface ContainerButtonsFormProps {
  textDangerBtn?: string;
  onClickDanger?: () => void;
  textSuccessBtn?: string;
}

export default function ContainerButtonsForm({
  textDangerBtn = "Cancel",
  textSuccessBtn = "Submit",
  onClickDanger,
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
      <Button variant="success" type="submit">
        {textSuccessBtn}
      </Button>
    </div>
  );
}
