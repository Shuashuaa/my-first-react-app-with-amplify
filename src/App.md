import { Amplify } from "aws-amplify";
import { getCurrentUser, fetchUserAttributes, signIn, signOut, signUp, confirmSignUp } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId: "647p68o88lfdi0plo0thqngola",
      userPoolId: "ap-southeast-1_HOQQzITYh",
    },
  },
});

function App() {
  const [user, setUser] = useState<{ username?: string; givenName?: string; loginId?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    async function checkUser() {
      try {
        const authUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();

        setUser({
          username: authUser.username,
          givenName: attributes.given_name ?? "User",
          loginId: authUser.signInDetails?.loginId ?? authUser.username,
        });
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, []);

  async function handleSignOut() {
    await signOut();
    setUser(null);
  }

  if (loading) return <h1>Loading...</h1>;

  return (
    <main className="p-5 w-full text-right">
      {user ? (
        <>
          <h2>Hello,<b>{user.givenName}!</b></h2>
          <h1>Welcome, {user.username}!</h1>
          <p>Login ID: {user.loginId}</p>
          <Button className="mt-2" onClick={handleSignOut}>Sign out</Button>
        </>
      ) : isRegistering ? (
        <SignUp setIsRegistering={setIsRegistering} />
      ) : (
        <SignIn setUser={setUser} setIsRegistering={setIsRegistering} />
      )}
    </main>
  );
}

// Sign-in Component
// function SignIn({ setUser, setIsRegistering }: { setUser: Function; setIsRegistering: Function }) {
//   const [formData, setFormData] = useState({ username: "", password: "" });
//   const [error, setError] = useState("");

//   async function handleSignIn(event: { preventDefault: () => void; }) {
//     event.preventDefault();
//     setError("");

//     try {
//       await signIn({ username: formData.username, password: formData.password });

//       const authUser = await getCurrentUser();
//       const attributes = await fetchUserAttributes();

//       setUser({
//         username: authUser.username,
//         givenName: attributes.given_name ?? "User",
//         loginId: authUser.signInDetails?.loginId ?? authUser.username,
//       });
//     } catch (err: any) {
//       setError(err.message || "Failed to sign in");
//     }
//   }

//   return (
//     <div className="w-full flex justify-end p-5">
//       <form className='flex flex-col gap-1 text-left w-1/4' onSubmit={handleSignIn}>
//         <h1>Sign In</h1>
//         {error && <p style={{ color: "red" }}>{error}</p>}
//         <Input
//           type="email"
//           placeholder="Email"
//           value={formData.username}
//           onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//         />
//         <Input
//           type="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//         />
//         <Button type="submit">Sign In</Button>
//         <p>
//           Don't have an account? <span onClick={() => setIsRegistering(true)} style={{ color: "blue", cursor: "pointer" }}>Register</span>
//         </p>
//       </form>
//     </div>
//   );
// }

// Sign-up Component
// function SignUp({ setIsRegistering }: { setIsRegistering: Function }) {
//   const [formData, setFormData] = useState({ username: "", password: "", givenName: "" });
//   const [error, setError] = useState("");
//   const [confirming, setConfirming] = useState(false);
//   const [confirmationCode, setConfirmationCode] = useState("");

//   async function handleSignUp(event: { preventDefault: () => void; }) {
//     event.preventDefault();
//     setError("");

//     try {
//       await signUp({
//         username: formData.username,
//         password: formData.password,
//         options: {
//           userAttributes: {
//             given_name: formData.givenName,
//           },
//         },
//       });

//       setConfirming(true);
//     } catch (err: any) {
//       setError(err.message || "Failed to register");
//     }
//   }

//   async function handleConfirmSignUp(event: { preventDefault: () => void; }) {
//     event.preventDefault();
//     setError("");

//     try {
//       await confirmSignUp({ username: formData.username, confirmationCode });

//       alert("Sign up confirmed! You can now sign in.");
//       setIsRegistering(false);
//     } catch (err: any) {
//       setError(err.message || "Failed to confirm sign-up");
//     }
//   }

//   if (confirming) {
//     return (
//       <div className="w-full flex justify-end p-5">
//         <form className='flex flex-col gap-1 text-left' onSubmit={handleConfirmSignUp}>
//           <h1>Confirm Sign Up</h1>
//           {error && <p style={{ color: "red" }}>{error}</p>}
//           <Input
//             type="text"
//             placeholder="Confirmation Code"
//             value={confirmationCode}
//             onChange={(e) => setConfirmationCode(e.target.value)}
//           />
//           <Button type="submit">Confirm</Button>
//         </form>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full flex justify-end p-5">
//       <form className='flex flex-col gap-1 text-left w-1/4' onSubmit={handleSignUp}>
//         <h1>Register</h1>
//         {error && <p style={{ color: "red" }}>{error}</p>}
//         <Input
//           type="text"
//           placeholder="Email"
//           value={formData.username}
//           onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//         />
//         <Input
//           type="text"
//           placeholder="Given Name"
//           value={formData.givenName}
//           onChange={(e) => setFormData({ ...formData, givenName: e.target.value })}
//         />
//         <Input
//           type="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//         />
//         <Button type="submit">Register</Button>
//         <p>
//           Already have an account? <span onClick={() => setIsRegistering(false)} style={{ color: "blue", cursor: "pointer" }}>Sign In</span>
//         </p>
//       </form>
//     </div>
//   );
// }

// export default App;