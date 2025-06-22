import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

const CommunityAvatar = ({ avatar, name }) => {
  return (
    <Avatar className="h-8 w-8 rounded-full">
      <AvatarImage src={avatar} alt={name} className="object-cover" />
      <AvatarFallback className="bg-gradient-to-br from-orange-300 to-orange-400 text-white text-xs font-medium">
        {name ? name.slice(0, 2).toUpperCase() : "CM"}
      </AvatarFallback>
    </Avatar>
  );
};

export default CommunityAvatar;
