import { Spinner } from "flowbite-react";

function LoadingStatus({ loadingMsg }) {
    console.log(loadingMsg);

    <div className="w-full my-20 items-center justify-center flex flex-row gap-2 self-center">
        <p className="text-base! font-medium text-slate-900">{loadingMsg}...</p>

        <Spinner size="md" />
    </div>
};

export default LoadingStatus;