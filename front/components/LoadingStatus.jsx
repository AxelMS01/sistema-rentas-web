import { Spinner } from "flowbite-react";

export default function LoadingStatus({loadingMsg}) {
    <div className="flex flex-row gap-2 self-center">
        <p className="text-base! font-medium text-slate-900">{loadingMsg}...</p>

        <Spinner size="md"/>
    </div>
}