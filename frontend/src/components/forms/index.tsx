import {
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "react-bootstrap";
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
  validate?: boolean;
  messageErroApi?: string;
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
  validate = false,
  messageErroApi,
}: BaseFormProps) {
  return (
    <Modal show>
      <ModalHeader>
        <h1 className="fs-3 m-0">{title}</h1>
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={onSubmit} noValidate validated={validate}>
          {children}
          <div
            className={`d-flex align-items-center justify-content-end ${
              textRedirect && "justify-content-between"
            }`}
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
      {messageErroApi && (
        <ModalFooter className="d-flex justify-content-start text-danger">
          {messageErroApi}
        </ModalFooter>
      )}
    </Modal>
  );
}
