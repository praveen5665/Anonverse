import React, { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import CommunityForm from "../CommunityForm";

const CreatePost = ({ onCommunityCreated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const communityMatch = location.pathname.match(/^\/r\/([^/]+)/);
  const currentCommunity = communityMatch ? communityMatch[1] : null;
  const [isCommunityFormOpen, setIsCommunityFormOpen] = useState(false);
  const handleCreatePost = () => {
    if (currentCommunity) {
      navigate(`/r/${currentCommunity}/submit`);
    }
  };

  const handleCreateCommunity = () => {
    setIsCommunityFormOpen(true);
  };

  return (
    // <div>
    //     <Button variant="ghost" className="bg-my_bg rounded-md">
    //     <Plus /> Create
    //     </Button>
    // </div>
    <div className="">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <div>
            <Button variant="ghost" className="bg-my_bg rounded-md">
              <Plus /> Create
            </Button>
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          className="bg-white shadow-md rounded-md p-2 mt-2 min-w-[150px] dark:bg-gray-800"
          side="bottom"
          align="end"
        >
          {currentCommunity && (
            <>
              <DropdownMenu.Item
                onClick={handleCreatePost}
                className="px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                <div>Post</div>
                <p className="text-[13px] text-gray-500">
                  share to r/{currentCommunity}
                </p>
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-600 my-2" />
            </>
          )}
          <DropdownMenu.Item
            onClick={handleCreateCommunity}
            className="px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            Community
            <p className="text-[13px] text-gray-500">Create a new Community</p>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      {isCommunityFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white rounded-lg shadow-lg w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            {/* Close Button at Top-Right */}
            <button
              onClick={() => setIsCommunityFormOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            {/* Your Form */}
            <CommunityForm
              onSuccess={(communityName) => {
                // Call the refresh function to update sidebar
                if (onCommunityCreated) {
                  onCommunityCreated();
                }
                setTimeout(() => {
                  setIsCommunityFormOpen(false);
                  navigate(`/r/${communityName}`);
                }, 1100);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
