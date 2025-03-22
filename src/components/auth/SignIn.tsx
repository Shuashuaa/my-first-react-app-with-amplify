import { Amplify } from "aws-amplify";
import { getCurrentUser, fetchUserAttributes, signIn } from "aws-amplify/auth";
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

interface FormData {
    username: string;
    password: string;
}

function SignIn({ setUser, setIsRegistering }: { setUser: Function; setIsRegistering: Function }) {

    const [formData, setFormData] = useState<FormData>({ username: "", password: "" });
    const [error, setError] = useState("");

    async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        try {
        await signIn({ username: formData.username, password: formData.password });

        const authUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();

        setUser({
            username: authUser.username,
            givenName: attributes.given_name ?? "User",
            loginId: authUser.signInDetails?.loginId ?? authUser.username,
        });
        } catch (err: any) {
            setError(err.message || "Failed to sign in");
        }
    }

    return (
        <div className="w-full flex justify-end p-5">
            <form className='flex flex-col gap-1 text-left w-1/4' onSubmit={handleSignIn}>
                <h1>Sign In</h1>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <Input
                type="email"
                placeholder="Email"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <Button type="submit">Sign In</Button>
                <p>
                Don't have an account? <span onClick={() => setIsRegistering(true)} style={{ color: "blue", cursor: "pointer" }}>Register</span>
                </p>
            </form>
        </div>
    );
}

export default SignIn;