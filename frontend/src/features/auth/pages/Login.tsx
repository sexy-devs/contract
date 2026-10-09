import LoginForm from "../components/LoginForm"
import { useLogin } from "../hooks/useLogin";

function Login() {
  const { submit, loading, error } = useLogin();

  async function handleSubmit(payload: { email: string; password: string }) {
    await submit(payload);
    return (console.log("continuar aca"))
  }
  return (
    <div id="login-page" className="bg-indigo-50 w-screen h-screen">
      <div id="content">
        <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default Login;