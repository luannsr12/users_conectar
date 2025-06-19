// utils/swal.js
import Swal from 'sweetalert2'

export const showSuccess = (title = "Sucesso!", text = "") => {
    return Swal.fire({
        icon: "success",
        title,
        text,
        confirmButtonColor: "#2563eb", // azul Tailwind
        didOpen: () => {
            Swal.hideLoading();
        }
    })
}

export const showError = (title = "Erro!", text = "") => {
    return Swal.fire({
        icon: "error",
        title,
        text,
        confirmButtonColor: "#dc2626", // vermelho Tailwind
        didOpen: () => {
            Swal.hideLoading();
        }
    })
}

export const showToast = (icon = "success", title = "", timer = 3000) => {
    return Swal.fire({
        toast: true,
        position: 'top-end',
        icon: icon,
        title: title,
        showConfirmButton: false,
        timer: timer,
        timerProgressBar: true,
        didOpen: () => {
            Swal.hideLoading();
        },
        customClass: {
            popup: 'bg-white shadow-lg rounded-lg p-4',
            title: 'text-sm font-medium',
        }
    });
}

export const showConfirm = (
    title = "Tem certeza?",
    text = "Essa ação não pode ser desfeita.",
    confirmButtonText = "Confirmar",
    cancelButtonText = "Cancelar"
) => {
    return Swal.fire({
        icon: "warning",
        title,
        text,
        showCancelButton: true,
        confirmButtonColor: "#dc2626", // vermelho Tailwind
        cancelButtonColor: "#6b7280", // cinza Tailwind
        confirmButtonText,
        cancelButtonText,
        didOpen: () => {
            Swal.hideLoading();
        }
    });
};

export const closeToast = () => {
    return Swal.close();
}

export const showLoadingToast = (
    title = "Carregando...",
    timeout = 60000 // 1 minuto
) => {
    return Swal.fire({
        title,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        backdrop: true, // fundo escuro (default)
        timer: timeout,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
        },
    });
};