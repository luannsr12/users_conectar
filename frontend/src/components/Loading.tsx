
import { OrbitProgress } from "react-loading-indicators";

export default function Loading() {

    return (

        <div style={{overflow: 'hidden'}} className="h-screen flex items-center justify-center">
            <OrbitProgress color="#5a15a3" size="medium" text="" textColor="" />
        </div>

    );
}
