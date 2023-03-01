import styles from './LoginPageForm.module.css'
import yknotlogo from '../../../assets/yknot-logo.png'

const LoginPageForm = () => {
    return <div>
        <div>{yknotlogo}</div>
        <h1>Sign In</h1>
        <input>Email</input>
        <input>Passoword</input>
        <p>Forgot Password?</p>
        <button>Sign In</button>
    </div>
}

export default LoginPageForm;