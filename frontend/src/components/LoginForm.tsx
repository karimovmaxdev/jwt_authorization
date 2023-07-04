import { useState, useContext } from "react";
import { Context } from "../index";

function LoginForm() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const {store} = useContext(Context);

    return (
        <div className="loginForm">
            <input 
                onChange={e => setEmail(e.target.value)}
                value={email}
                type='text' 
                placeholder="Email"
            />

            <input 
                onChange={e => setPassword(e.target.value)}
                value={password}
                type='password' 
                placeholder="Password"
            />

            <button onClick={() => store.login(email, password)}>Login</button>
            <button onClick={() => store.register(email, password)}>Register</button>

        </div>
    );
}

export default LoginForm;
