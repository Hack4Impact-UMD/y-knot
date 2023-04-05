import styles from './Modal.module.css';

interface modalPropsType {
  open: boolean;
  onClose: any;
  children: React.ReactNode;
  type: string;
}

// used to set height of modal based on "type" prop passed in
type modalTypes = Record<string, any>;

const modalTypeMap: modalTypes = {
  // height = 200px
  forgotPassword: styles.forgotPassword,
  // height = 325px
  resetPassword: styles.resetPassword,
  // height = 275px
  resetEmail: styles.resetEmail,
};

const Modal = ({
  open,
  onClose,
  children,
  type,
}: modalPropsType): React.ReactElement => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {open ? (
        <>
          <div className={styles.background} onClick={() => onClose()} />
          <div className={styles.centered}>
            <div className={`${styles.modal} ${modalTypeMap[type]}`}>
              {children}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Modal;
