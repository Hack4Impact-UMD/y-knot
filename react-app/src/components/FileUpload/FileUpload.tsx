import styles from './FileUpload.module.css';

const FileUpload = () => {
  /* 
    Consider scanning the file through an antivirus (like https://www.virustotal.com/gui/home/upload)
    They usually have small limits which is why I avoided it here.
  */
  const maxFileSize = 1048576 * 0.1; // 20MB
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files![0]);
    console.log(event.target.files![0].type);
    if (event.target.files && event.target.files![0].size > maxFileSize) {
      alert('File is too big');
      event.target.value = '';
      return;
    }
  };

  return (
    <div>
      <form>
        <input
          type="file"
          onChange={handleFileChange}
          className={styles.input}
        />
      </form>
    </div>
  );
};

export default FileUpload;
