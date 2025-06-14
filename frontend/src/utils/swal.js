// utils/swal.js
import Swal from 'sweetalert2'

export const showSuccess = (title = "Sucesso!", text = "") => {
    return Swal.fire({
        icon: "success",
        title,
        text,
        confirmButtonColor: "#2563eb", // azul Tailwind
    })
}

export const showError = (title = "Erro!", text = "") => {
    return Swal.fire({
        icon: "error",
        title,
        text,
        confirmButtonColor: "#dc2626", // vermelho Tailwind
    })
}

export const showToast = (icon = "success", title = "") => {
    return Swal.fire({
        toast: true,
        position: 'top-end',
        icon: icon,
        title: title,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
            popup: 'bg-white shadow-lg rounded-lg p-4',
            title: 'text-sm font-medium',
        }
    });
}