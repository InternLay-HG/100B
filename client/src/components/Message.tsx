import { useSelector } from "react-redux";

const Message = ({ message }: any) => {
    const user = useSelector((state: any) => state.auth.userData);
    const isUser = message.senderId == user.id;

    return (
        <div className="">
            {isUser ? (
                <div className="flex flex-col mt-2 mb-1">
                    <div className="ml-auto mr-6">
                        <div
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg w-auto max-w-[384px]"
                            style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
                        >
                            {message.content}
                        </div>
                        <time className="text-xs text-gray-500">
                            12:30
                        </time>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col mt-2 mb-1">
                    <div className="mr-6 w-fit">
                        <div
                            className="px-4 py-2 bg-white text-black rounded-lg max-w-[384px]"
                            style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
                        >
                            {message.content}
                        </div>
                        <time className="text-xs text-gray-500">
                            12:30
                        </time>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Message;
