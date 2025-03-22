
import { Amplify } from "aws-amplify";
import { signUp, confirmSignUp } from "aws-amplify/auth";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

Amplify.configure({
  Auth: {
    Cognito: {
        userPoolClientId: "647p68o88lfdi0plo0thqngola",
        userPoolId: "ap-southeast-1_HOQQzITYh"
    },
  },
});

function SignUp({ setIsRegistering }: { setIsRegistering: Function }
) {
    const [formData, setFormData] = useState({ username: "", password: "", givenName: "" });
    const [error, setError] = useState("");
    const [confirming, setConfirming] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState("");

    async function handleSignUp(event: { preventDefault: () => void; }) {
        event.preventDefault();
        setError("");

        try {
        await signUp({
            username: formData.username,
            password: formData.password,
            options: {
            userAttributes: {
                given_name: formData.givenName,
            },
            },
        });

        setConfirming(true);
        } catch (err: any) {
        setError(err.message || "Failed to register");
        }
    }

    async function handleConfirmSignUp(event: { preventDefault: () => void; }) {
        event.preventDefault();
        setError("");

        try {
        await confirmSignUp({ username: formData.username, confirmationCode });

        alert("Sign up confirmed! You can now sign in.");
        setIsRegistering(false);
        } catch (err: any) {
        setError(err.message || "Failed to confirm sign-up");
        }
    }

    if (confirming) {
        return (
        <div className="w-full flex justify-end p-5">
            <form className='flex flex-col gap-1 text-left' onSubmit={handleConfirmSignUp}>
            <h1>Confirm Sign Up</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <Input
                type="text"
                placeholder="Confirmation Code"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
            />
            <Button type="submit">Confirm</Button>
            </form>
        </div>
        );
    }

    return (
        <div className="w-full flex justify-end p-5">
            <form className='flex flex-col gap-1 text-left w-1/4' onSubmit={handleSignUp}>
                <h1>Register</h1>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <Input
                type="text"
                placeholder="Email"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                <Input
                type="text"
                placeholder="Given Name"
                value={formData.givenName}
                onChange={(e) => setFormData({ ...formData, givenName: e.target.value })}
                />
                <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <Button type="submit">Register</Button>
                <p>
                Already have an account? <span onClick={() => setIsRegistering(false)} style={{ color: "blue", cursor: "pointer" }}>Sign In</span>
                </p>
            </form>
        </div>
    );
}

export default SignUp;