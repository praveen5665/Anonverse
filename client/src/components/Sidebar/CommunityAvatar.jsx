import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";

const CommunityAvatar = () => {
  return (
    <div className="bg-gray-400 w-8 h-8 rounded-2xl">
      <Avatar>
  <AvatarImage src="https://github.com/shadcn.png" className="w-8 h-8 rounded-full" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
    </div>
  );
};

export default CommunityAvatar;
