
export default function GoogleLoginButton() {
  return (
    <div className='flex justify-center'>
      <button
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
