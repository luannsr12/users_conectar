import withMT from "@material-tailwind/html/utils/withMT";
import { colors } from "./src/styles/colors.js";

/** @type {import('tailwindcss').Config} */
export default withMT({
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,jsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
});
