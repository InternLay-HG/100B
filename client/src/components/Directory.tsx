import { toast } from "sonner";
import { useState } from "react";
import { IoMdPersonAdd } from "react-icons/io";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Loader2 } from "lucide-react";

const Directory = ({ contact }: any) => {
    const [loading, setLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();

    let initials = contact.name[0];
    for (let i = 0; i < contact.name.length; i++) {
        if (contact.name[i] == ' ' && i != contact.name.length - 1) {
            initials += contact.name[i + 1].toUpperCase();
            break;
        }
    }

    const handleAddContact = async () => {
        try {
            setLoading(true);
            const response = await axiosPrivate.post('/api/v1/conversation', {
                contactId: contact.id
            })
            console.log(response);
        } catch (error: any) {
            console.log(error);
            if (error.response.data.message)
                toast.error(error.response.data.message);
            else
                toast.error("Failed to add to contacts")
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex w-full h-16 cursor-pointer">
            <div className="flex items-center justify-center w-[20%]">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="profilepic.png" />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
            </div>
            <div className="flex h-full flex-col">
                <div className="flex h-full items-center font-semibold">
                    {contact?.name}
                </div>
            </div>
            <div className="ml-auto mr-5 flex items-center">
                {loading ? (
                    <div>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    </div>
                ) : (
                    <div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div
                                        className="p-2 rounded-full hover:bg-orange-500"
                                        onClick={handleAddContact}
                                    >
                                        <IoMdPersonAdd className="w-5 h-5" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Add contact</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                )}
            </div>
        </div >
    )
}

export default Directory