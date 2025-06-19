interface PhoneMockupProps {
    src: string;
}

export default function PhoneMockup({ src }: PhoneMockupProps) {
    return (
        <>
            {/* Botões laterais esquerdos */}
            <div style={{ left: "-63px" }} className="h-[32px] z-50 w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg" />
            <div style={{ left: "-63px" }}  className="h-[46px] w-[3px] bg-gray-800 absolute z-50 -start-[17px] top-[124px] rounded-s-lg" />
            <div style={{ left: "-63px" }}  className="h-[46px] w-[3px] bg-gray-800 absolute z-50 -start-[17px] top-[178px] rounded-s-lg" />

            {/* Botão lateral direito */}
            <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px]  rounded-e-lg" />

            <div className="relative right-15 top-[-50px] mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[330px] shadow-xl overflow-hidden">
                {/* Tela interna */}
                <div className="rounded-[2rem] left-[-20px] overflow-hidden w-[350px] h-[680px] bg-white relative">
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
        </>
    );
}