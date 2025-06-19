/// <reference types="vite/client" />

import { useAuthStore } from "../stores/useAuthStore";
import { useMessageStore, MomentMessage } from "../stores/useMessageStore";

const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

export default function GoogleLoginButton() {
  const setLogin = useAuthStore((state) => state.setLogin);
  const { setMessage } = useMessageStore();

  const handleLogin = () => {

    const googleAuthWindow = window.open(
      `${API_URL}/auth/google`,
      'GoogleLogin',
      'width=600,height=800'
    );


    window.addEventListener('message', (event) => {
      if (event.origin !== API_URL) return;

      try {


        if (event.data.success) {

          const { token, user } = event.data;

          setLogin(token);

          setMessage({
            'type': 'success',
            'message': "Login bem sucedido!"
          } as MomentMessage);

        } else {
          console.error("Erro no login Google:", event.data.error);
          setMessage({
            'type': 'error',
            'message': event.data.error || "Erro ao realizar login."
          } as MomentMessage);
        }

      } catch (error) {
        setMessage({
          'type': 'error',
          'message': "Erro ao realizar login."
        } as MomentMessage);
      } finally {
        if (googleAuthWindow) {
          googleAuthWindow.close();
        }
      }

    });


  };

  return (
    <div className='flex justify-center'>
      <button
        onClick={handleLogin}
        className="justify-center cursor-pointer group h-12 w-[100%] sm:w-[80%] px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-purple-400 focus:bg-blue-50 active:bg-blue-100">
        <div className="relative flex items-center space-x-4 justify-center">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="absolute left-0 w-4 sm:w-5" alt="google logo" />
          <span
            className="btn-google block pl-4 sm:pl-0 w-max tracking-wide text-gray-700 dark:text-white text-md text-sm text-xs transition duration-300 hover:text-purple-400 sm:text-base">Continue
            com Google
          </span>
        </div>
      </button>
    </div>
  );
}
