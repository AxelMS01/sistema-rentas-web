import { ChartColumnIncreasing } from "lucide-react";

export default function ChartCard({ title, children }) {
    return (
        <div className="w-full bg-white border items-start gap-3 flex flex-col rounded-xl border-slate-200 p-6">
            <div className="flex flex-row gap-2 items-center justify-center">
                <div className="p-2! self-start rounded-full bg-sky-100 text-sky-600">
                    <ChartColumnIncreasing size={21} strokeWidth={2}/>
                </div>

                <p className="font-normal text-base! text-slate-500">Estadísticas</p>
            </div>

            <h1 className="text-xl! font-semibold! text-start! text-slate-800!">{title}</h1>

            {children}
        </div>
    )
}