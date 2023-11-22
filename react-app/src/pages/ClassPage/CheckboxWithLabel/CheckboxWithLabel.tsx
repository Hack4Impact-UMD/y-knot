import React, { useState, useEffect } from 'react';
import styles from './CheckboxWithLabel.module.css';

interface CheckboxWithLabelProps {
  checkedText: string;
  uncheckedText: string;
  isChecked: boolean;
  setIsChecked: Function;
}

const CheckboxWithLabel = ({
  checkedText,
  uncheckedText,
  isChecked,
  setIsChecked,
}: CheckboxWithLabelProps): React.ReactElement => {
  const [localIsChecked, setlocalIsChecked] = useState(isChecked);

  useEffect(() => {
    if (isChecked) {
      setlocalIsChecked(isChecked);
    }
  }, [isChecked]);

  function handleCheckboxChange() {
    if (localIsChecked) {
      setIsChecked(false);
    }
    setlocalIsChecked(!localIsChecked);
  }

  return (
    <div className={styles.icons}>
      <label className={styles.checkboxContainer}>
        <input
          type="checkbox"
          checked={localIsChecked}
          onChange={handleCheckboxChange}
        ></input>
        <span className={styles.checkmark}></span>
      </label>
      <label className={styles.statusLabel}>
        {localIsChecked ? checkedText : uncheckedText}
      </label>
    </div>
  );
};

export default CheckboxWithLabel;
