import { Form, Modal, ModalBody, ModalHeader } from "react-bootstrap";
import ContainerButtonsForm from "../containers/buttons-form";

interface BaseFormProps {
  title: string;
  children: React.ReactNode;
  textRedirect?: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClickCancel?: () => void;
  onClickRedirect?: () => void;
  textBtnDanger?: string;
  textBtnSuccess?: string;
}

export default function BaseForm({
  onClickCancel,
  onClickRedirect,
  title,
  children,
  onSubmit,
  textRedirect,
  textBtnDanger,
  textBtnSuccess,
}: BaseFormProps) {
  return (
    <Modal show>
      <ModalHeader>
        <h1 className="fs-3 m-0">{title}</h1>
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={onSubmit}>
          {children}
          <div
            className={`d-flex align-items-center justify-content-end ${textRedirect && "justify-content-between"}`}
          >
            {textRedirect && (
              <p
                className="text-primary m-0 cursor-pointer"
                onClick={onClickRedirect}
              >
                {textRedirect}
              </p>
            )}
            <ContainerButtonsForm
              onClickDanger={onClickCancel}
              textDangerBtn={textBtnDanger}
              textSuccessBtn={textBtnSuccess}
            />
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
}
