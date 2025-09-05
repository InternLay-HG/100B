import "./error.css"
import Particles from "./Particles";

const NotFoundPage = () => {
    return (
        <div className="flex justify-center items-center h-screen w-screen bg-white">
            <Particles />
            <svg
                width="380"
                height="500"
                viewBox="0 0 837 1045"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <path
                        d="M353,9 L626.664028,170 L626.664028,487 L353,642 L79.3359724,487 L79.3359724,170 L353,9 Z"
                        stroke="#000000"
                        strokeWidth="8"
                        className="animate-float1"
                    ></path>
                    <path
                        d="M78.5,529 L147,569.186414 L147,648.311216 L78.5,687 L10,648.311216 L10,569.186414 L78.5,529 Z"
                        stroke="#000000"
                        strokeWidth="8"
                        className="animate-float2"
                    ></path>
                    <path
                        d="M773,186 L827,217.538705 L827,279.636651 L773,310 L719,279.636651 L719,217.538705 L773,186 Z"
                        stroke="#000000"
                        strokeWidth="8"
                        className="animate-float3"
                    ></path>
                    <path
                        d="M639,529 L773,607.846761 L773,763.091627 L639,839 L505,763.091627 L505,607.846761 L639,529 Z"
                        stroke="#000000"
                        strokeWidth="8"
                        className="animate-float4"
                    ></path>
                    <path
                        d="M281,801 L383,861.025276 L383,979.21169 L281,1037 L179,979.21169 L179,861.025276 L281,801 Z"
                        stroke="#000000"
                        strokeWidth="8"
                        className="animate-float5"
                    ></path>
                </g>
            </svg>
            <div
                id="message-box"
                className="h-[200px] w-[380px] text-white font-light text-center"
            >
                <h1 className="text-[60px] text-black leading-[46px] mb-[40px]">404</h1>
                <p className="text-black">Page not found</p>
                <div id="buttons-con" className="mt-[40px]">
                    <div id="action-link-wrap">
                        <a
                            onClick={() => history.back()}
                            id="link-back-button"
                            className="bg-black text-white font-bold text-sm py-2 px-6 rounded transition-all duration-300 hover:bg-[#5A5C6C] cursor-pointer"
                        >
                            Go Back
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
