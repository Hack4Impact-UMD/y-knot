import styles from './Modal.module.css';

interface modalPropsType {
  open: boolean;
  onClose: any;
  children: React.ReactNode;
}

const Modal = ({
  open,
  onClose,
  children,
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
            <div className={styles.modal}>{children}</div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Modal;
