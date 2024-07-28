import styles from './FileUpload.module.css';

const FileUpload = () => {
  /* 
    Consider scanning the file through an antivirus (like https://www.virustotal.com/gui/home/upload)
    They usually have small limits which is why I avoided it here.
  */
  const maxFileSize = 1048576 * 20; // 20MB
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const currFile = event.target.files[0];
      const reg = /^[^.]+.ts$/;
      if (event.target.files![0].size > maxFileSize) {
        alert('File is too big');
        event.target.value = '';
        return;
      }
    }
  };

  return (
    <div>
      <form>
        <input
          type="file"
          onChange={handleFileChange}
          className={styles.input}
          accept=".csv, .doc, .docx, .gif, .jpeg, .jpg, .mp3, .mp4, .pdf, .png, .ppt, .pptx, .txt, .xls, .xlsx, .xml"
        />
      </form>
    </div>
  );
};

export default FileUpload;
