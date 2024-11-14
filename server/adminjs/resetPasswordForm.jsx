import React, {useState} from "react";
import { useParams } from "react-router";

const ResetPasswordForm = () => {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const { token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/reset/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({password}),
            });

            const data = await response.text();
            setMessage(data);
        } catch (error) {
            setMessage("Error sending resetting password");
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>New Password:</label>
                    <input type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />
                </div>
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
};

export default ResetPasswordForm;

