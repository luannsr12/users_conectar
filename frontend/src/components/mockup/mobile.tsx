interface PhoneMockupProps {
    src: string;
}

export default function PhoneMockup({ src }: PhoneMockupProps) {
    return (
        <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] top-[-100px] right-10 h-[700px] w-[350px] shadow-xl overflow-hidden">

            {/* Botões laterais esquerdos */}
            <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg" />
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg" />
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg" />

            {/* Botão lateral direito */}
            <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg" />

            {/* Tela interna */}
            <div className="rounded-[1.5rem] overflow-hidden w-[340px] h-[672px] bg-white relative">
                <iframe
                    src={src}
                    title="Mobile Preview"
                    className="w-full h-full"
                    style={{
                        border: "none",
                        overflow: "hidden",
                    }}
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                />
            </div>
        </div>
    );
}
  